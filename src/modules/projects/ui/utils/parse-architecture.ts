export interface ParsedArchitecture {
  hasDiagram: boolean;
  diagramContent?: string;
  documentation?: string;
}

/**
 * Parses architecture message content to extract Mermaid diagram and documentation
 */
export const parseArchitectureMessage = (
  content: string
): ParsedArchitecture => {
  // Look for Mermaid code blocks
  const mermaidRegex = /```mermaid\s*\n([\s\S]*?)\n```/i;
  const match = content.match(mermaidRegex);

  if (!match) {
    return {
      hasDiagram: false,
      documentation: content,
    };
  }

  let diagramContent = match[1].trim();

  // Clean up the diagram content
  diagramContent = diagramContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  // Extract documentation (everything after the Mermaid block)
  const afterMermaid = content.substring(match.index! + match[0].length).trim();

  // Remove the "## Architecture Documentation" header if present
  let documentation = afterMermaid
    .replace(/^##\s*Architecture\s*Documentation\s*\n?/i, "")
    .trim();

  // Clean up markdown formatting
  documentation = documentation
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting
    .replace(/\*(.*?)\*/g, "$1") // Remove italic formatting
    .replace(/`(.*?)`/g, "$1") // Remove code formatting
    .trim();

  return {
    hasDiagram: true,
    diagramContent,
    documentation: documentation || undefined,
  };
};

/**
 * Checks if a message content contains a Mermaid diagram
 */
export const hasMermaidDiagram = (content: string): boolean => {
  return /```mermaid\s*\n[\s\S]*?\n```/i.test(content);
};

/**
 * Checks if a message content contains user stories
 */
export const hasUserStories = (content: string): boolean => {
  return (
    content.toLowerCase().includes("user stories") ||
    content.includes("As a") ||
    content.includes("Acceptance Criteria:")
  );
};

/**
 * Checks if a message content contains architecture documentation (without diagram)
 */
export const hasArchitectureDocs = (content: string): boolean => {
  return (
    !content.includes("```mermaid") &&
    !content.toLowerCase().includes("user stories") &&
    (content.toLowerCase().includes("system overview") ||
      content.toLowerCase().includes("key components") ||
      content.toLowerCase().includes("technology stack") ||
      content.toLowerCase().includes("architectural decisions") ||
      content.toLowerCase().includes("data flow"))
  );
};
