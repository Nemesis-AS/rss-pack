import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/ApiError";
export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const errorRes: { message: string; details: object | null } = {
    message: err instanceof Error ? err.message : String(err),
    details: null,
  };

  if (err instanceof ApiError) {
    res.status(err.statusCode);
    errorRes.details = err.details ?? null;
  } else {
    res.status(500);
  }

  res.json({ error: errorRes });
}
