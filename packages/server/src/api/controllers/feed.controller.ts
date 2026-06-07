import type { Request, Response } from "express";
import prisma from "../../db/prisma";
import ApiError from "../../utils/ApiError";

export const getAllFeeds = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 25;
  const page = Number(req.query.page) || 1;

  const offset = (page - 1) * limit;

  const [feeds, totalCount] = await Promise.all([
    prisma.feed.findMany({
      take: limit,
      skip: offset,
    }),
    prisma.feed.count(),
  ]);

  res.json({
    data: feeds,
    meta: {
      page,
      perPage: limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
};

export const addFeedMonitoring = async (req: Request, res: Response) => {
  const { feedUrl } = req.body;

  if (!feedUrl) throw ApiError.badRequest("feed url is required");

  const newFeed = await prisma.feed.create({
    data: {
      url: feedUrl,
    },
  });

  res.json({
    data: newFeed,
  });
};

export const getFeedById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) throw ApiError.badRequest("id is required");

  const feed = await prisma.feed.findFirst({ where: { id: String(id) } });

  if (!feed) throw ApiError.notFound("feed");

  res.json({
    data: feed,
  });
};

export const getArticlesByFeedid = async (req: Request, res: Response) => {
  const { id } = req.params;
  const limit = Number(req.query.limit) || 25;
  const page = Number(req.query.page) || 1;

  const offset = (page - 1) * limit;

  const [articles, articleCount] = await Promise.all([
    prisma.article.findMany({
      where: { feedId: String(id) },
      take: limit,
      skip: offset,
    }),
    prisma.article.count({
      where: { feedId: String(id) },
    }),
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
