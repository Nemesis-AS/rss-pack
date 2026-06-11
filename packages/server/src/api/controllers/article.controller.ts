import { Request, Response } from "express";
import prisma from "../../db/prisma";
import ApiError from "../../utils/ApiError";
import { ArticleWhereInput } from "../../db/generated/prisma/models";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export const getAllArticles = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const feedId = req.query.feed ? String(req.query.feed) : null;
  const query = req.query.query ? String(req.query.query) : null;
  const starred = !!req.query.starred;

  const offset = (page - 1) * limit;

  const whereClause: ArticleWhereInput = {};

  if (feedId) whereClause.feedId = feedId;
  if (starred) whereClause.isStarred = true;

  if (query)
    whereClause.title = {
      contains: query,
    };

  const [articles, articleCount] = await Promise.all([
    prisma.article.findMany({
      take: limit,
      skip: offset,
      where: whereClause,
      omit: { content: true },
    }),
    prisma.article.count(),
  ]);

  res.json({
    data: articles,
    meta: {
      page,
      perPage: limit,
      total: articleCount,
      totalPages: Math.ceil(articleCount / limit),
    },
  });
};

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const article = await prisma.article.findFirst({ where: { id: String(id) } });

  if (!article) throw ApiError.NotFound("article");

  return res.json({
    data: article,
  });
};

export const setArticleStarred = async (req: Request, res: Response) => {
  const { id } = req.params;
  const unstar = !!req.query.unstar;

  try {
    await prisma.article.update({
      where: { id: String(id) },
      data: { isStarred: !unstar },
    });

    res.json({ data: id });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      throw ApiError.NotFound("article");
    throw ApiError.InternalServerError(
      "an error occurred while (un)starring article",
    );
  }
};

export const setArticleRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const unread = !!req.query.unread;

  try {
    await prisma.article.update({
      where: { id: String(id) },
      data: { isRead: !unread },
    });

    res.json({ data: id });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      throw ApiError.NotFound("article");
    throw ApiError.InternalServerError(
      "an error occurred while (un)starring article",
    );
  }
};
