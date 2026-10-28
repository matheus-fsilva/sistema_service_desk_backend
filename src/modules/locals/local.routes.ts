import { Router } from "express";

import localController from "./local.controller";
import validateSchema from "../../middlewares/validateSchema";

import { createLocalSchema } from "./dto/create-local.dto";

const localRoutes = Router();

// #region GET /locals/:id
/**
 * @openapi
 * /locals/{id}:
 *   get:
 *     tags:
 *       - Locals
 *     summary: Buscar local por ID
 *     description: Retorna os dados de um local específico.
 *     operationId: getLocalById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do local.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       '200':
 *         description: Local encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocalResponse'
 *             example:
 *               id: 1
 *               nome: Laboratório de Informática 01
 *               descricao: Laboratório utilizado para aulas práticas.
 *               ativo: true
 *               created_at: '2026-10-27T14:00:00.000Z'
 *               updated_at: '2026-10-27T14:00:00.000Z'
 *       '400':
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               message: Identificador inválido.
 *       '404':
 *         description: Local não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               message: Local não encontrado.
 */

localRoutes.get("/:id", localController.show.bind(localController));
// #endregion

// #region POST /locals
/**
 * @openapi
 * /locals:
 *   post:
 *     tags:
 *       - Locals
 *     summary: Cadastrar local
 *     description: Cadastra um novo local na FATEC Guarulhos.
 *     operationId: createLocal
 *     requestBody:
 *       required: true
 *       description: Dados necessários para cadastrar o local.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLocal'
 *           example:
 *             nome: Laboratório de Informática 01
 *             descricao: Laboratório utilizado para aulas práticas.
 *     responses:
 *       '201':
 *         description: Local cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocalResponse'
 *             example:
 *               id: 1
 *               nome: Laboratório de Informática 01
 *               descricao: Laboratório utilizado para aulas práticas.
 *               ativo: true
 *               created_at: '2026-10-27T14:00:00.000Z'
 *               updated_at: '2026-10-27T14:00:00.000Z'
 *       '400':
 *         description: Dados da requisição inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               message: O nome deve possuir no máximo 100 caracteres.
 *       '409':
 *         description: Já existe um local com esse nome.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               message: Este local já está cadastrado.
 */
localRoutes.post(
  "/",
  validateSchema(createLocalSchema),
  localController.store.bind(localController),
);
// #endregion

// #region DELETE /locals/:id
/**
 * @openapi
 * /locals/{id}:
 *   delete:
 *     tags:
 *       - Locals
 *     summary: Excluir local
 *     description: Exclui um local pelo seu identificador.
 *     operationId: deleteLocal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do local.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       '204':
 *         description: Local excluído com sucesso.
 *       '400':
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Local não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
localRoutes.delete("/:id", localController.destroy.bind(localController));
// #endregion

export default localRoutes;
