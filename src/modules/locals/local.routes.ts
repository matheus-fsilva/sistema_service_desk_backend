import { Router } from "express";

import localController from "./local.controller";

import validateSchema from "../../middlewares/validateSchema";
import validateQuerySchema from "../../middlewares/validateQuerySchema";
import authMiddleware from "../../middlewares/authMiddleware";
import ensureUserRole from "../../middlewares/ensureUserRole";

import { createLocalSchema } from "./dto/create-local.dto";
import { updateLocalSchema } from "./dto/update-local.dto";
import { searchLocalSchema } from "./dto/search-local.dto";

const localRoutes = Router();

localRoutes.use(authMiddleware);

// #region GET /locals
/**
 * @openapi
 * /locals:
 *   get:
 *     tags:
 *       - Locals
 *     summary: Listar locais
 *     description: Lista os locais ativos com busca por nome, paginação e ordenação por identificador.
 *     operationId: indexLocals
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Trecho do nome utilizado para filtrar os locais.
 *         example: Laboratório
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Quantidade máxima de registros por página.
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC, asc, desc]
 *           default: ASC
 *         description: Ordenação dos locais pelo identificador.
 *     responses:
 *       '200':
 *         description: Locais listados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocalListResponse'
 *       '400':
 *         description: Parâmetros de consulta inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Usuário sem permissão para consultar locais.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
localRoutes.get(
  "/",
  ensureUserRole("N1", "N2", "Admin"),
  validateQuerySchema(searchLocalSchema),
  localController.index.bind(localController),
);
// #endregion

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
 *       '400':
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Usuário sem permissão para consultar locais.
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
localRoutes.get(
  "/:id",
  ensureUserRole("N1", "N2", "Admin"),
  localController.show.bind(localController),
);
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
 *       '400':
 *         description: Dados da requisição inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Usuário sem permissão para cadastrar locais.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Já existe um local com esse nome.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
localRoutes.post(
  "/",
  ensureUserRole("Admin"),
  validateSchema(createLocalSchema),
  localController.store.bind(localController),
);
// #endregion

// #region PUT /locals/:id
/**
 * @openapi
 * /locals/{id}:
 *   put:
 *     tags:
 *       - Locals
 *     summary: Atualizar local
 *     description: Atualiza o nome, a descrição ou ambos os campos de um local.
 *     operationId: updateLocal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do local.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLocal'
 *           example:
 *             nome: Laboratório de Informática 02
 *             descricao: Laboratório atualizado.
 *     responses:
 *       '200':
 *         description: Local atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocalResponse'
 *       '400':
 *         description: Dados inválidos ou identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Usuário sem permissão para atualizar locais.
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
 *       '409':
 *         description: Já existe um local com esse nome.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
localRoutes.put(
  "/:id",
  ensureUserRole("Admin"),
  validateSchema(updateLocalSchema),
  localController.update.bind(localController),
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
 *     description: Realiza a exclusão lógica de um local, alterando seu campo ativo para false.
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
 *         description: Local excluído logicamente com sucesso.
 *       '400':
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Usuário sem permissão para excluir locais.
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
 *       '409':
 *         description: Não é possível excluir o local porque existem equipamentos ativos vinculados a ele.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
localRoutes.delete(
  "/:id",
  ensureUserRole("Admin"),
  localController.destroy.bind(localController),
);
// #endregion

export default localRoutes;
