import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import database from "../config/database.config";
import authConfig from "../config/auth.config";
import AppError from "../errors/AppError";

import User from "../modules/users/users.entity";

const authMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError("Token de autenticação não informado.", 401);
    }

    const tokenMatch = authorization.match(/^Bearer\s+(\S+)$/i);

    if (!tokenMatch) {
      throw new AppError("Formato do token de autenticação inválido.", 401);
    }

    const token = tokenMatch[1];

    let decoded: JwtPayload;

    try {
      const payload = jwt.verify(token, authConfig.jwt.secret, {
        algorithms: [authConfig.jwt.algorithm],
      });

      if (typeof payload === "string" || typeof payload.sub !== "string") {
        throw new Error("Payload inválido.");
      }

      decoded = payload;
    } catch {
      throw new AppError("Token inválido ou expirado.", 401);
    }

    const userId = Number(decoded.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new AppError("Token inválido ou expirado.", 401);
    }

    const userRepository = database.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user || !user.ativo) {
      throw new AppError("Usuário não encontrado ou inativo.", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
