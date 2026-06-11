import { createHash } from "crypto";
import Parser from "rss-parser";

export async function fetchFeed(feedUrl: string) {
  const parser = new Parser();
  const feed = await parser.parseURL(feedUrl);

  return {
    title: feed.title ?? null,
    description: feed.description ?? null,
    siteUrl: feed.link ?? null,
    articles: feed.items.map((item) => {
      const guid = item.guid ?? item.link ?? null;
      const url = item.link ?? null;
      const title = item.title ?? "";

      return {
        guid,
        url,
        title,
        author: item.creator ?? item.author ?? null,
        summary: item.contentSnippet ?? null,
        content: item.content ?? item["content:encoded"] ?? null,
        publishedAt: item.isoDate ? new Date(item.isoDate) : null,
        contentHash: createHash("sha256")
          .update(guid ?? url ?? title)
          .digest("hex"),
      };
    }),
  };
}
