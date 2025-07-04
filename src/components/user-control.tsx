"use client"

import Link from "next/link"
import { User, LogOut, CreditCardIcon } from "lucide-react"
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

export const UserControls = () => {
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

    if (isPending) {
        return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
    }

    if (user) {
        return (
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
                        <Link href="/pricing" className="cursor-pointer">
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
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="sign-in">Sign In</Link>
            </Button>
            <Button asChild>
                <Link href="sign-up">Sign Up</Link>
            </Button>
        </div>
    )
}
