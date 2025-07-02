import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { authProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const messagesRouter = createTRPCRouter({
  getMany: authProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is reqiured." }),
      })
    )
    .query(async ({ input, ctx }) => {
      const message = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: { userId: ctx.userId },
        },
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          fragment: true,
        },
      });
      return message;
    }),
  create: authProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Value is required" })
          .max(1500, { message: "Value is too long" }),
        projectId: z.string().min(1, { message: "Project ID is reqiured." }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.userId,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found!",
        });
      }

      const createdMessage = await prisma.message.create({
        data: {
          projectId: existingProject.id,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });

      return createdMessage;
    }),
});
