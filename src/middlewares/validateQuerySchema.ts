import type { RequestHandler } from "express";
import { z } from "zod";
import AppError from "../errors/AppError";

const validateQuerySchema = (schema: z.ZodType): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join(".") : "query",
        message: issue.message,
      }));

      next(
        new AppError("Os parâmetros de pesquisa são inválidos.", 400, details),
      );

      return;
    }

    res.locals.validatedQuery = result.data;

    next();
  };
};

export default validateQuerySchema;
