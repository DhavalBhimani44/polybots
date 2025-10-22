"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import mermaid from "mermaid";

interface MermaidDiagramProps {
    content: string;
    className?: string;
}

export const MermaidDiagram = ({ content, className }: MermaidDiagramProps) => {
    const diagramRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!diagramRef.current || !content) return;

        // Initialize Mermaid with theme support
        mermaid.initialize({
            startOnLoad: false,
            theme: "default", // Will be updated based on system theme
            securityLevel: "loose",
            fontFamily: "inherit",
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
            },
        });

        // Clear previous content
        diagramRef.current.innerHTML = "";

        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Clean and validate the content
        const cleanContent = content.trim();

        // Basic validation - ensure it starts with a valid diagram type
        if (!cleanContent.match(/^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|gitgraph|mindmap|timeline|sankey-beta|quadrantChart|requirement|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment)/i)) {
            if (diagramRef.current) {
                diagramRef.current.innerHTML = `
          <div class="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
            <p class="text-sm">Invalid diagram format</p>
            <details class="mt-2 text-xs">
              <summary class="cursor-pointer">Show content</summary>
              <pre class="mt-2 text-left overflow-auto whitespace-pre-wrap">${cleanContent}</pre>
            </details>
          </div>
        `;
            }
            return;
        }

        try {
            // Render the diagram
            mermaid.render(id, cleanContent).then(({ svg }) => {
                if (diagramRef.current) {
                    diagramRef.current.innerHTML = svg;
                }
            }).catch((error) => {
                console.error("Mermaid rendering error:", error);
                if (diagramRef.current) {
                    diagramRef.current.innerHTML = `
            <div class="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
              <p class="text-sm">Failed to render diagram</p>
              <details class="mt-2 text-xs">
                <summary class="cursor-pointer">Show error</summary>
                <pre class="mt-2 text-left overflow-auto">${error.message}</pre>
              </details>
              <details class="mt-2 text-xs">
                <summary class="cursor-pointer">Show content</summary>
                <pre class="mt-2 text-left overflow-auto whitespace-pre-wrap">${cleanContent}</pre>
              </details>
            </div>
          `;
                }
            });
        } catch (error) {
            console.error("Mermaid initialization error:", error);
            if (diagramRef.current) {
                diagramRef.current.innerHTML = `
          <div class="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
            <p class="text-sm">Failed to initialize diagram</p>
            <details class="mt-2 text-xs">
              <summary class="cursor-pointer">Show content</summary>
              <pre class="mt-2 text-left overflow-auto whitespace-pre-wrap">${cleanContent}</pre>
            </details>
          </div>
        `;
            }
        }
    }, [content]);

    return (
        <Card className={cn("p-4 overflow-x-auto border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/30 to-muted/10", className)}>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                <span className="text-xs font-medium text-muted-foreground">System Architecture</span>
            </div>
            <div ref={diagramRef} className="mermaid-diagram" />
            {/* Debug: Show raw content in development */}
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">Debug: Show raw Mermaid content</summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-left overflow-auto whitespace-pre-wrap text-xs">
                        {content}
                    </pre>
                </details>
            )}
        </Card>
    );
};
