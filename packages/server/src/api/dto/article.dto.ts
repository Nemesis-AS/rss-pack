import * as z from "zod";

export const getAllArticlesDto = {
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).optional(),
    query: z.string().optional(),
  }),
};

export const articleIdParam = {
  params: z.object({
    id: z.uuidv4(),
  }),
};
