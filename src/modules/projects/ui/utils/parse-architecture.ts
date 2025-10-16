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
  const documentation = afterMermaid
    .replace(/^##\s*Architecture\s*Documentation\s*\n?/i, "")
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
