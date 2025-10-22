"use client";

import { Typewriter } from "@/components/ui/typewriter";

interface TypewriterPresetsProps {
    text: string;
    className?: string;
    onComplete?: () => void;
}

// Fast typewriter for short content
export const FastTypewriter = ({ text, className, onComplete }: TypewriterPresetsProps) => (
    <Typewriter
        text={text}
        speed={15}
        startDelay={100}
        showCursor={true}
        cursorChar="|"
        className={className}
        onComplete={onComplete}
    />
);

// Medium typewriter for normal content
export const MediumTypewriter = ({ text, className, onComplete }: TypewriterPresetsProps) => (
    <Typewriter
        text={text}
        speed={30}
        startDelay={200}
        showCursor={true}
        cursorChar="|"
        className={className}
        onComplete={onComplete}
    />
);

// Slow typewriter for dramatic effect
export const SlowTypewriter = ({ text, className, onComplete }: TypewriterPresetsProps) => (
    <Typewriter
        text={text}
        speed={50}
        startDelay={500}
        showCursor={true}
        cursorChar="▋"
        className={className}
        onComplete={onComplete}
    />
);

// User stories specific typewriter
export const UserStoriesTypewriter = ({ text, className, onComplete }: TypewriterPresetsProps) => (
    <Typewriter
        text={text}
        speed={20}
        startDelay={300}
        showCursor={true}
        cursorChar="▋"
        className={className}
        onComplete={onComplete}
    />
);

// Architecture documentation specific typewriter
export const ArchitectureTypewriter = ({ text, className, onComplete }: TypewriterPresetsProps) => (
    <Typewriter
        text={text}
        speed={25}
        startDelay={200}
        showCursor={true}
        cursorChar="|"
        className={className}
        onComplete={onComplete}
    />
);
