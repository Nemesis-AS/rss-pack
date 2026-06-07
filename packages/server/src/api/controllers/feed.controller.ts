import type { Request, Response } from "express";
import prisma from "../../db/prisma";
import ApiError from "../../utils/ApiError";
import {
  FeedWhereInput,
  PrismaClientKnownRequestError,
} from "../../db/generated/prisma/internal/prismaNamespace";

export const getAllFeeds = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 25;
  const page = Number(req.query.page) || 1;
  const query = req.query.query ? String(req.query.query) : null;
  const includeDisabled = !!req.query.disabled;

  const offset = (page - 1) * limit;

  const whereClause: FeedWhereInput = {};

  if (!includeDisabled) whereClause.isDisabled = false;

  if (query)
    whereClause.title = {
      contains: query,
    };

  const [feeds, totalCount] = await Promise.all([
    prisma.feed.findMany({
      take: limit,
      skip: offset,
      where: whereClause,
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

  // @todo! Update this to fetch feed metadata using core

  if (!feedUrl) throw ApiError.BadRequest("feed url is required");

  const newFeed = await prisma.feed.create({
    data: {
      url: feedUrl,
    },
  });

  res.json({
    data: newFeed,
  });
};

export const removeFeedMonitoring = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.feed.delete({ where: { id: String(id) } });

    res.json({
      data: id,
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      throw ApiError.NotFound("feed");

    throw ApiError.InternalServerError(
      "an error occurred while removing feed monitoring",
    );
  }
};

export const getFeedById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) throw ApiError.BadRequest("id is required");

  const feed = await prisma.feed.findFirst({ where: { id: String(id) } });

  if (!feed) throw ApiError.NotFound("feed");

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

export const disableFeed = async (req: Request, res: Response) => {
  const { id } = req.params;
  const enable = !!req.query.enable;

  try {
    await prisma.feed.update({
      where: { id: String(id) },
      data: {
        isDisabled: !enable,
      },
    });

    res.json({
      data: id,
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      throw ApiError.NotFound("feed");
    throw ApiError.InternalServerError(
      "an error occurred while disabling/enabling feed",
    );
  }
};

export const syncFeed = async (req: Request, res: Response) => {
  const { id } = req.params;

  const feed = await prisma.feed.findFirst({ where: { id: String(id) } });

  if (!feed) throw ApiError.NotFound("feed");

  // @todo! Implement this
  res.json({
    data: "WIP! Feed sync would be added later",
  });
};
