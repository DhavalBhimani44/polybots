"use client";

import { useEffect, useState } from "react";
import { ArchitectureTypewriter } from "@/components/ui/typewriter-presets";

interface DelayedArchitectureDocsProps {
    content: string;
    delay?: number; // delay in milliseconds
}

export const DelayedArchitectureDocs = ({
    content,
    delay = 2000
}: DelayedArchitectureDocsProps) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldRender(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    if (!shouldRender) {
        return null;
    }

    return <ArchitectureTypewriter text={content} />;
};
