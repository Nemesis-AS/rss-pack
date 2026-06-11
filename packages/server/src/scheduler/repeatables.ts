import prisma from "../db/prisma.js";
import { feedRefreshQueue } from "./queue.js";

function jobSchedulerId(feedId: string) {
  return `refresh-${feedId}`;
}

export async function scheduleFeedRefresh(
  feedId: string,
  refreshInterval: number,
) {
  await feedRefreshQueue.upsertJobScheduler(
    jobSchedulerId(feedId),
    { every: refreshInterval * 1000 },
    { data: { feedId } },
  );
}

export async function unscheduleFeedRefresh(feedId: string) {
  await feedRefreshQueue.removeJobScheduler(jobSchedulerId(feedId));
}

export async function scheduleAllFeeds() {
  const feeds = await prisma.feed.findMany({
    where: { isDisabled: false },
    select: { id: true, refreshInterval: true },
  });

  for (const feed of feeds) {
    await scheduleFeedRefresh(feed.id, feed.refreshInterval);
  }
}
