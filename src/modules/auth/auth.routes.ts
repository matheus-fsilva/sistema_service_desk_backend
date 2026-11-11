import { Router } from "express";

import authController from "./auth.controller";
import { loginSchema } from "./dto/login.dto";

import validateSchema from "../../middlewares/validateSchema";
import { loginRateLimiter } from "../../middlewares/rateLimit";

const authRoutes = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Autenticar usuário
 *     description: Realiza o login e retorna os dados do usuário e o Access Token.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Dados enviados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               status: error
 *               statusCode: 400
 *               message: Os dados enviados são inválidos.
 *               errors:
 *                 - field: email
 *                   message: Informe um endereço de e-mail válido.
 *       401:
 *         description: E-mail ou senha inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               status: error
 *               statusCode: 401
 *               message: E-mail ou senha inválidos.
 *               errors: []
 *       429:
 *         description: Limite de tentativas de login excedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               status: error
 *               statusCode: 429
 *               message: Muitas tentativas de login. Tente novamente após 15 minutos.
 *               errors: []
 */
authRoutes.post(
  "/login",
  loginRateLimiter,
  validateSchema(loginSchema),
  authController.login,
);

export default authRoutes;
