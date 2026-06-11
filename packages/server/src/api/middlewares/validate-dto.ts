import { NextFunction, Request, Response } from "express";
import * as z from "zod";
import ApiError from "../../utils/ApiError";

export interface SchemaInput<
  T extends z.ZodType,
  U extends z.ZodType,
  V extends z.ZodType,
> {
  params?: T;
  query?: U;
  body?: V;
}

export default function validateDto<
  T extends z.ZodType,
  U extends z.ZodType,
  V extends z.ZodType,
>(schema: SchemaInput<T, U, V>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.params?.parse(req.params);
      schema.query?.parse(req.query);
      schema.body?.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(ApiError.BadRequest(error.issues[0].message));
      } else
        next(
          ApiError.InternalServerError("An error occurred while parsing input"),
        );
    }
  };
}
