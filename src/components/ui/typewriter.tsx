"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
    text: string;
    speed?: number; // milliseconds per character
    className?: string;
    onComplete?: () => void;
    startDelay?: number; // delay before starting
    showCursor?: boolean; // show blinking cursor
    cursorChar?: string; // cursor character
}

export const Typewriter = ({
    text,
    speed = 30,
    className,
    onComplete,
    startDelay = 0,
    showCursor = true,
    cursorChar = "|"
}: TypewriterProps) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!text) return;

        let timeoutId: NodeJS.Timeout;
        let currentIndex = 0;

        const startTyping = () => {
            const typeNextChar = () => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                    timeoutId = setTimeout(typeNextChar, speed);
                } else {
                    setIsComplete(true);
                    onComplete?.();
                }
            };

            typeNextChar();
        };

        if (startDelay > 0) {
            timeoutId = setTimeout(startTyping, startDelay);
        } else {
            startTyping();
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [text, speed, onComplete, startDelay]);

    return (
        <div className={cn("whitespace-pre-wrap", className)}>
            {displayedText}
            {showCursor && !isComplete && (
                <span className="animate-pulse text-primary">{cursorChar}</span>
            )}
        </div>
    );
};
