import type { RequestHandler } from "express";

import AppError from "../errors/AppError";
import type User from "../modules/users/users.entity";

const ensureUserRole = (...allowedRoles: User["tipo"][]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError("Usuário não autenticado.", 401));
    }

    if (!allowedRoles.includes(req.user.tipo)) {
      return next(
        new AppError(
          "Você não possui permissão para realizar esta operação.",
          403,
        ),
      );
    }

    next();
  };
};

export default ensureUserRole;
