"use client"

import Image from "next/image"
import Link from "next/link"
import { User, LogOut, CreditCardIcon, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useTheme } from "next-themes"

export const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const { data: session, isPending } = authClient.useSession()
    const user = session?.user

    const handleSignOut = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Successfully logged out")
                    }
                }
            })
        } catch (error) {
            console.error("Sign out error:", error)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <nav className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent">
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

                    {/* User Profile or Auth Buttons */}
                    {isPending ? (
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                                        <AvatarFallback>
                                            {user.name ? getInitials(user.name) : <User className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/" className="cursor-pointer">
                                        <CreditCardIcon className="mr-2 h-4 w-4" />
                                        <span>Billing</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link href="sign-in">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="sign-up">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}