import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";

const FREE_POINTS = 3;
const GENERATION_COST = 1;
const DURATION = 30 * 24 * 60 * 60; //30 days

export async function getUsageTracker() {
  //TODO: After subscribing get points back
  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: FREE_POINTS,
    duration: DURATION,
  });
  return usageTracker;
}

export async function consumeCredits() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not authenticated");

  const usageTracker = await getUsageTracker();

  const result = await usageTracker.consume(userId, GENERATION_COST);

  return result;
}

export async function getUsageStatus() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not authenticated");

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
}
