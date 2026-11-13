import { Request, Response, NextFunction } from "express";

export const loginRateLimiter = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next();
};
