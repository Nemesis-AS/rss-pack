import { Queue } from "bullmq";
import connection from "./connection";

export const FEED_REFRESH_QUEUE = "feed-refresh";

export const feedRefreshQueue = new Queue(FEED_REFRESH_QUEUE, { connection: connection as any });

export async function enqueueFeedRefresh(feedId: string) {
  await feedRefreshQueue.add("refresh", { feedId });
}
