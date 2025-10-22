import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { MessageCard } from "./message-card"
import { MessageForm } from "./message-form"
import { useEffect, useRef } from "react"
import { Fragment } from "@/generated/prisma"
import { MessageLoading } from "./message-loading"
import { UserStoriesLoading } from "./user-stories-loading"
import { ArchitectureLoading } from "./architecture-loading"
import { ArchitectureDiagramLoading } from "./architecture-diagram-loading"

interface Props {
    projectId: string
    activeFragment: Fragment | null
    setActiveFragment: (fragment: Fragment | null) => void
}

export const MessagesContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
    const trpc = useTRPC()
    const bottomRef = useRef<HTMLDivElement>(null)
    const lastAssistantMessageIdRef = useRef<string | null>(null)

    const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
        projectId,
    }, {
        refetchInterval: 2000,
    }))

    useEffect(() => {
        const lastAssistantMessage = messages.findLast(
            (message) => message.role === "ASSISTANT",
        )
        if (lastAssistantMessage?.fragment && lastAssistantMessage.id !== lastAssistantMessageIdRef.current) {
            setActiveFragment(lastAssistantMessage.fragment)
            lastAssistantMessageIdRef.current = lastAssistantMessage.id
        }
    }, [messages, setActiveFragment])

    useEffect(() => {
        bottomRef.current?.scrollIntoView()
    }, [messages.length])

    const lastMessage = messages[messages.length - 1]
    const isLastMessageUser = lastMessage?.role === "USER"

    // Determine which loading state to show based on message progression
    const getUserStoriesMessage = () => messages.find(m =>
        m.role === "ASSISTANT" &&
        m.content.toLowerCase().includes("user stories")
    )

    const getArchitectureDiagramMessage = () => messages.find(m =>
        m.role === "ASSISTANT" &&
        m.content.includes("```mermaid") &&
        m.content.includes("Architecture Diagram")
    )

    const getArchitectureDocsMessage = () => messages.find(m =>
        m.role === "ASSISTANT" &&
        !m.content.includes("```mermaid") &&
        !m.content.toLowerCase().includes("user stories") &&
        !m.fragment
    )

    const getCodeMessage = () => messages.find(m =>
        m.role === "ASSISTANT" &&
        m.fragment !== null
    )

    const showUserStoriesLoading = isLastMessageUser && !getUserStoriesMessage()
    const showArchitectureLoading = getUserStoriesMessage() && !getArchitectureDiagramMessage() && !getArchitectureDocsMessage() && !showUserStoriesLoading
    const showArchitectureDiagramLoading = getArchitectureDiagramMessage() && !getArchitectureDocsMessage() && !showUserStoriesLoading && !showArchitectureLoading
    const showCodeLoading = getArchitectureDocsMessage() && !getCodeMessage() && !showUserStoriesLoading && !showArchitectureLoading && !showArchitectureDiagramLoading

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="pt-2 pr-1 ">
                    {messages.map((message) => (
                        <MessageCard
                            key={message.id}
                            content={message.content}
                            role={message.role}
                            fragment={message.fragment}
                            createdAt={message.createdAt}
                            isActiveFragment={activeFragment?.id === message.fragment?.id}
                            onFragmentClick={() => setActiveFragment(message.fragment)}
                            type={message.type}
                        />
                    ))}
                    {showUserStoriesLoading && <UserStoriesLoading />}
                    {showArchitectureLoading && <ArchitectureLoading />}
                    {showArchitectureDiagramLoading && <ArchitectureDiagramLoading />}
                    {showCodeLoading && <MessageLoading />}
                    <div ref={bottomRef} />
                </div>
            </div>
            <div className="relative p-3 pt-1">
                <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
                <MessageForm projectId={projectId} />
            </div>
        </div>
    )
}