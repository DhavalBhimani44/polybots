import { auth } from "@/lib/auth"
import { ProjectView } from "@/modules/projects/ui/views/project-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

interface Props {
    params: Promise<{
        projectId: string
    }>
}

const Page = async ({ params }: Props) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
  
    if(!!session){
      redirect('/sign-in')
    }
    const { projectId } = await params

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId,
    }))
    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }))
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<div>Loading...</div>}>
                <ProjectView projectId={projectId} />
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page