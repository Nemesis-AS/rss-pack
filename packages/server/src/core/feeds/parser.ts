import Parser from "rss-parser";

export async function fetchFeed(feedUrl: string) {
  const parser = new Parser();
  const feed = await parser.parseURL(feedUrl);

  console.log(Object.keys(feed));
}
