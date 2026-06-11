import prisma from "../../db/prisma.js";
import ApiError from "../../utils/ApiError.js";
import { indexArticles } from "../articles/indexer.js";
import { fetchFeed } from "./parser.js";

export async function indexFeed(feedId: string) {
  const feed = await prisma.feed.findUnique({
    where: { id: feedId },
    select: { url: true },
  });

  if (!feed) throw ApiError.NotFound("feed");

  try {
    const { articles, ...data } = await fetchFeed(feed.url);

    await prisma.feed.update({
      where: { id: feedId },
      data: {
        ...data,
        lastFetchedAt: new Date(),
        lastSuccessfulFetchAt: new Date(),
        lastErrorAt: null,
        lastErrorMessage: null,
        failureCount: 0,
      },
    });

    await indexArticles(feedId, articles);
  } catch (error) {
    await prisma.feed.update({
      where: { id: feedId },
      data: {
        lastFetchedAt: new Date(),
        lastErrorAt: new Date(),
        lastErrorMessage:
          error instanceof Error ? error.message : String(error),
        failureCount: { increment: 1 },
      },
    });
  }
}
