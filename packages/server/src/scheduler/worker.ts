import { Worker } from "bullmq";
import { indexFeed } from "../core/feeds/indexer.js";
import connection from "./connection.js";
import { FEED_REFRESH_QUEUE } from "./queue.js";
import logger from "../utils/logger.js";

export const feedRefreshWorker = new Worker(
  FEED_REFRESH_QUEUE,
  async (job) => {
    const { feedId } = job.data as { feedId: string };
    logger.info({ jobId: job.id, feedId }, "feed refresh job started");
    await indexFeed(feedId);
    logger.info({ jobId: job.id, feedId }, "feed refresh job completed");
  },
  { connection: connection as any, concurrency: 1 },
);

feedRefreshWorker.on("failed", (job, error) => {
  logger.error(
    { jobId: job?.id, feedId: job?.data?.feedId, err: error },
    "feed refresh job failed",
  );
});
