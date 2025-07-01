import { Navbar } from "@/modules/home/ui/components/navbar"

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <main className="flex flex-col min-h-screen max-h-screen">
            <Navbar />
            <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="flex flex-col flex-1 px-4 pb-4 overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-secondary hover:scrollbar-thumb-primary/80 scrollbar-thumb-rounded-md scrollbar-track-rounded-md">
                {children}
            </div>
        </main>
    )
}

export default Layout