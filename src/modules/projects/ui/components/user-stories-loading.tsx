"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import Image from "next/image";

interface UserStoriesLoadingProps {
    className?: string;
}

export const UserStoriesLoading = ({ className }: UserStoriesLoadingProps) => {
    return (
        <div className={cn("flex flex-col group px-2 pb-4", className)}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image src="/logo.svg" alt="logo" width={18} height={18} className="shrink-0" />
                <span className="text-sm font-medium">Polybots</span>
                <span className="text-xs text-muted-foreground">Generating user stories...</span>
            </div>
            <div className="pl-8.5">
                <Card className="p-4 border-dashed border-2 border-muted-foreground/20 bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Analyzing requirements</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                        </div>
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="h-2 bg-muted-foreground/10 rounded animate-pulse"></div>
                        <div className="h-2 bg-muted-foreground/10 rounded animate-pulse w-3/4"></div>
                        <div className="h-2 bg-muted-foreground/10 rounded animate-pulse w-1/2"></div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
