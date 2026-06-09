import * as z from "zod";

export const getAllFeedsDto = {
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).optional(),
    query: z.string().optional(),
  }),
};

export const addFeedMonitoringDto = {
  body: z.object({ feedUrl: z.url() }),
};

export const feedIdParamDto = {
  params: z.object({ id: z.uuidv4() }),
};

export const getArticlesByFeedDto = {
  ...feedIdParamDto,
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).optional(),
  }),
};
