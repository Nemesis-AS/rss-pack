import prisma from "../../db/prisma";
import ApiError from "../../utils/ApiError";
import { fetchFeed } from "./parser";

export async function indexFeed(feedId: string) {
  const feed = await prisma.feed.findUnique({
    where: { id: feedId },
    select: { url: true },
  });

  if (!feed) throw ApiError.NotFound("feed");

  const data = fetchFeed(feed.url);

  await prisma.feed.update({
    where: { id: feedId },
    data: {
      ...data,
      lastFetchedAt: new Date(),
    },
  });
}
