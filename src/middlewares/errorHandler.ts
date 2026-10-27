import type { ErrorRequestHandler } from "express";
import AppError from "../errors/AppError";

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Erro interno do servidor.",
    errors: [],
  });
};

export default errorHandler;
