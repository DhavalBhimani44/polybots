"use client"

import Image from "next/image"
import Link from "next/link"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"
import { UserControls } from "@/components/user-control"

export const Navbar = () => {
    const isScrolled = useScroll()
    const { theme, setTheme } = useTheme()

    return (
        <nav className={cn(
            "p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent",
            isScrolled && "bg-background border-border"
        )}>
            <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
                {/* Logo */}
                <Link href='/' className="flex items-center gap-2">
                    <Image
                        src='/logo.svg'
                        alt="logo"
                        width={24}
                        height={24}
                    />
                    <span className="font-semibold text-lg text-gray-900 dark:text-accent-foreground">Polybots</span>
                </Link>

                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="h-8 w-8 p-0"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* User Controls */}
                    <UserControls />
                </div>
            </div>
        </nav>
    )
}
