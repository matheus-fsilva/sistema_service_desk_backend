import { Router } from "express";

import authController from "./auth.controller";
import { loginSchema } from "./dto/login.dto";

import validateSchema from "../../middlewares/validateSchema";

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
 */
authRoutes.post("/login", validateSchema(loginSchema), authController.login);

export default authRoutes;
