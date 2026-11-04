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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao.silva@fatec.sp.gov.br
 *               senha:
 *                 type: string
 *                 example: Senha123!
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso.
 *       401:
 *         description: E-mail ou senha inválidos.
 *       422:
 *         description: Dados enviados inválidos.
 */
authRoutes.post("/login", validateSchema(loginSchema), authController.login);

export default authRoutes;
