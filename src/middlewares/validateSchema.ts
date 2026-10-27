import type { RequestHandler } from "express";
import { z } from "zod";
import AppError from "../errors/AppError";

const validateSchema = (schema: z.ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join(".") : "body",
        message: issue.message,
      }));

      next(new AppError("Os dados enviados são inválidos.", 400, details));

      return;
    }

    req.body = result.data;

    next();
  };
};

export default validateSchema;
