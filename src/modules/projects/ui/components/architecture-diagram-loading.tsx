"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Network } from "lucide-react";
import Image from "next/image";

interface ArchitectureDiagramLoadingProps {
    className?: string;
}

export const ArchitectureDiagramLoading = ({ className }: ArchitectureDiagramLoadingProps) => {
    return (
        <div className={cn("flex flex-col group px-2 pb-4", className)}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image src="/logo.svg" alt="logo" width={18} height={18} className="shrink-0" />
                <span className="text-sm font-medium">Polybots</span>
                <span className="text-xs text-muted-foreground">Rendering architecture diagram...</span>
            </div>
            <div className="pl-8.5">
                <Card className="p-4 border-dashed border-2 border-muted-foreground/20 bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Network className="w-4 h-4" />
                            <span className="text-sm font-medium">Preparing visual diagram</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-32 bg-muted-foreground/5 rounded-lg border border-dashed border-muted-foreground/20 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Network className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-xs text-muted-foreground">Diagram ready, rendering...</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
