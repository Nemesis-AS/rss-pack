import prisma from "../../db/prisma.js";
import type { ArticleUncheckedCreateInput } from "../../db/generated/prisma/models/Article.js";

type ParsedArticle = Omit<ArticleUncheckedCreateInput, "feedId">;

export async function indexArticles(feedId: string, articles: ParsedArticle[]) {
  for (const article of articles) {
    await prisma.article.upsert({
      where: {
        feedId_contentHash: {
          feedId,
          contentHash: article.contentHash,
        },
      },
      create: {
        ...article,
        feedId,
      },
      update: {
        ...article,
      },
    });
  }
}
