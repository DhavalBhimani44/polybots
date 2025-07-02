import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, authProcedure } from "@/trpc/init";

export const usageRouter = createTRPCRouter({
    status: authProcedure.query(async () => {
        try{
            const result = await getUsageStatus()

            return result
        }catch{
            return null
        }
    }),


})