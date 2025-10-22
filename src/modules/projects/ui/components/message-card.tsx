import { Card } from "@/components/ui/card"
import { Fragment, MessageRole, MessageType } from "@/generated/prisma"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { format } from 'date-fns'
import { ChevronRightIcon, Code2Icon } from "lucide-react"
import { MermaidDiagram } from "./mermaid-diagram"
import { parseArchitectureMessage, hasMermaidDiagram, hasUserStories, hasArchitectureDocs } from "../utils/parse-architecture"
import { UserStoriesTypewriter, ArchitectureTypewriter } from "@/components/ui/typewriter-presets"
import { DelayedArchitectureDocs } from "./delayed-architecture-docs"

interface UserMessageProps {
    content: string
}

const UserMessage = ({ content }: UserMessageProps) => {
    return (
        <div className="flex justify-end pb-4 pr-2 pl-10 animate-in slide-in-from-right-2 duration-300">
            <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words hover:shadow-sm transition-shadow">
                {content}
            </Card>
        </div>
    )
}

interface FragmentCardProps {
    fragment: Fragment
    isActiveFragment: boolean
    onFragmentClick: (fragment: Fragment) => void
}

const FragmentCard = ({
    fragment,
    isActiveFragment,
    onFragmentClick,
}: FragmentCardProps) => {
    return (
        <button className={cn(
            "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
            isActiveFragment && "bg-primary text-primary-foreground border-primary hover:bg-primary shadow-md"
        )}
            onClick={() => onFragmentClick(fragment)}
        >
            <Code2Icon className="size-4 mt-0.5" />
            <div className="flex flex-col flex-1">
                <span className="text-sm font-medium">
                    {fragment.title}
                </span>
                <span className="text-xs opacity-70">Preview</span>
            </div>
            <div className="flex items-center justify-center mt-0.5">
                <ChevronRightIcon className="size-4" />
            </div>
        </button>
    )
}

interface AssistantMessageProps {
    content: string
    fragment: Fragment | null
    createdAt: Date
    isActiveFragment: boolean
    onFragmentClick: (fragment: Fragment) => void
    type: MessageType
}

const AssistantMessage = ({
    content,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type
}: AssistantMessageProps) => {
    const isArchitectureMessage = hasMermaidDiagram(content);
    const isUserStoriesMessage = hasUserStories(content);
    const isArchitectureDocsMessage = hasArchitectureDocs(content);
    const parsedArchitecture = isArchitectureMessage ? parseArchitectureMessage(content) : null;

    return (
        <div className={cn(
            "flex flex-col group px-2 pb-4 animate-in slide-in-from-left-2 duration-300",
            type === "ERROR" && "text-red-700 dark:text-red-500"
        )}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image src="/logo.svg" alt="logo" width={18} height={18} className="shrink-0" />
                <span className="text-sm font-medium">Polybots</span>
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
                </span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                {isArchitectureMessage && parsedArchitecture ? (
                    <>
                        {parsedArchitecture.hasDiagram && parsedArchitecture.diagramContent && (
                            <MermaidDiagram
                                content={parsedArchitecture.diagramContent}
                                className="mb-4"
                            />
                        )}
                        {parsedArchitecture.documentation && (
                            <ArchitectureTypewriter text={parsedArchitecture.documentation} />
                        )}
                    </>
                ) : isUserStoriesMessage ? (
                    <UserStoriesTypewriter text={content} />
                ) : isArchitectureDocsMessage ? (
                    <DelayedArchitectureDocs content={content} delay={2000} />
                ) : (
                    <div className="whitespace-pre-wrap">{content}</div>
                )}
                {fragment && type === "RESULT" && (
                    <FragmentCard
                        fragment={fragment}
                        isActiveFragment={isActiveFragment}
                        onFragmentClick={onFragmentClick}
                    />
                )}
            </div>
        </div>
    )
}

interface Props {
    content: string
    role: MessageRole
    fragment: Fragment | null
    createdAt: Date
    isActiveFragment: boolean
    onFragmentClick: (fragment: Fragment) => void
    type: MessageType
}

export const MessageCard = ({
    content,
    role,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type
}: Props) => {
    if (role === "ASSISTANT") {
        return (
            <AssistantMessage
                content={content}
                fragment={fragment}
                createdAt={createdAt}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        )
    }

    return (
        <UserMessage
            content={content}
        />
    )
}