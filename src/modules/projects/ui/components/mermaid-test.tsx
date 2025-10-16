"use client";

import { MermaidDiagram } from "./mermaid-diagram";

// Simple test diagram to verify Mermaid is working
const testDiagram = `flowchart TD
    A[User] --> B[Frontend App]
    B --> C[API Layer]
    C --> D[Database]
    D --> E[External Service]`;

export const MermaidTest = () => {
    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Mermaid Test Diagram</h3>
            <MermaidDiagram content={testDiagram} />
        </div>
    );
};
