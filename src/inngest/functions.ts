import { inngest } from "./client";
import {
  gemini,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
  type Message,
  createState,
} from "@inngest/agent-kit";

import { Sandbox } from "@e2b/code-interpreter";
import {
  getSandbox,
  lastAssistantTextMessageContext,
  parseAgentOutput,
} from "./utils";
import { parseArchitectureMessage } from "../modules/projects/ui/utils/parse-architecture";
import { z } from "zod";
import {
  ARCHITECTURE_PROMPT,
  FRAGMENT_TITLE_PROMPT,
  PROMPT,
  RESPONSE_PROMPT,
  USER_STORIES_PROMPT,
} from "@/prompt";
import { prisma } from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
  architecture: string;
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("polybots-nextjs");
      await sandbox.setTimeout(60_000 * 10 * 3);
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];

        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
        architecture: "",
      },
      {
        messages: previousMessages,
      }
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.0-flash-exp",
        apiKey: process.env.GEMINI_API_KEY,
        defaultParameters: {
          generationConfig: {
            temperature: 0.7,
          },
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Run commands in the terminal",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                );
                return `Command failed: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (e) {
                  console.error(`Failed to create or update files: ${e}`);
                  return "Error: " + e;
                }
              }
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (e) {
                console.error(`Failed to read files: ${e}`);
                return "Error: " + e;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContext(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const userStoriesGenerator = createAgent({
      name: "user-stories-generator",
      description: "Generates structured user stories with acceptance criteria",
      system: USER_STORIES_PROMPT,
      model: gemini({
        model: "gemini-2.0-flash-exp",
        apiKey: process.env.GEMINI_API_KEY,
      }),
    });

    const { output: userStoriesOutput } = await userStoriesGenerator.run(
      event.data.value || "Generate user stories for a web application"
    );

    await step.run("save-user-stories", async () => {
      try {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: parseAgentOutput(userStoriesOutput),
            role: "ASSISTANT",
            type: "RESULT",
          },
        });
      } catch (e) {
        console.error("Error saving user stories:", e);
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content:
              "Something went wrong generating user stories. Please try again!",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
    });

    // Step 2: Generate System Architecture
    const architectureAgent = createAgent({
      name: "architecture-agent",
      description: "Generates system architecture diagrams and documentation",
      system: ARCHITECTURE_PROMPT,
      model: gemini({
        model: "gemini-2.0-flash-exp",
        apiKey: process.env.GEMINI_API_KEY,
      }),
    });

    const { output: architectureOutput } = await architectureAgent.run(
      parseAgentOutput(userStoriesOutput)
    );

    // Parse architecture output to separate diagram and documentation
    const parsedArchitecture = parseArchitectureMessage(
      parseAgentOutput(architectureOutput)
    );

    // Save architecture diagram first (if available)
    if (parsedArchitecture.hasDiagram && parsedArchitecture.diagramContent) {
      await step.run("save-architecture-diagram", async () => {
        try {
          return await prisma.message.create({
            data: {
              projectId: event.data.projectId,
              content: `\`\`\`mermaid\n${parsedArchitecture.diagramContent}\n\`\`\`\n\n## Architecture Diagram`,
              role: "ASSISTANT",
              type: "RESULT",
            },
          });
        } catch (e) {
          console.error("Error saving architecture diagram:", e);
          return null;
        }
      });
    }

    // Save architecture documentation separately (if available)
    if (parsedArchitecture.documentation) {
      await step.run("save-architecture-docs", async () => {
        try {
          return await prisma.message.create({
            data: {
              projectId: event.data.projectId,
              content: parsedArchitecture.documentation!,
              role: "ASSISTANT",
              type: "RESULT",
            },
          });
        } catch (e) {
          console.error("Error saving architecture documentation:", e);
          return await prisma.message.create({
            data: {
              projectId: event.data.projectId,
              content:
                "Something went wrong generating system architecture documentation. Please try again!",
              role: "ASSISTANT",
              type: "ERROR",
            },
          });
        }
      });
    }

    // Step 3: Run Code Agent
    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    const result = await network.run(
      event.data.value || "Build a web application",
      { state }
    );

    // Step 4: Generate response and fragment title
    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "Generates fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: gemini({
        model: "gemini-2.0-flash-exp",
        apiKey: process.env.GEMINI_API_KEY,
      }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "Generates response",
      system: RESPONSE_PROMPT,
      model: gemini({
        model: "gemini-2.0-flash-exp",
        apiKey: process.env.GEMINI_API_KEY,
      }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary || "Web application built successfully"
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary || "Web application built successfully"
    );

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const standboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    // Step 5: Save Code Result
    await step.run("save-code-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again!",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: standboxUrl,
              title: parseAgentOutput(fragmentTitleOutput),
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: standboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
