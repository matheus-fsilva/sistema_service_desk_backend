import { Router } from "express";

import equipmentController from "./equipment.controller";

import validateSchema from "../../middlewares/validateSchema";
import validateQuerySchema from "../../middlewares/validateQuerySchema";
import authMiddleware from "../../middlewares/authMiddleware";
import ensureUserRole from "../../middlewares/ensureUserRole";

import { createEquipmentSchema } from "./dto/create-equipment.dto";
import { updateEquipmentSchema } from "./dto/update-equipment.dto";
import { searchEquipmentSchema } from "./dto/search-equipment.dto";

const equipmentRoutes = Router();

equipmentRoutes.use(authMiddleware);

// #region GET /equipment
/**
 * @openapi
 * /equipment:
 *   get:
 *     tags:
 *       - Equipment
 *     summary: Listar equipamentos
 *     description: Lista os equipamentos ativos com busca por nome, paginação e ordenação por identificador.
 *     operationId: indexEquipments
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Trecho do nome utilizado para filtrar os equipamentos.
 *         example: Computador
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
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Ordenação dos equipamentos pelo identificador.
 *     responses:
 *       '200':
 *         description: Equipamentos listados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EquipmentListResponse'
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
 *         description: Usuário sem permissão para listar equipamentos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
equipmentRoutes.get(
  "/",
  ensureUserRole("N1", "N2", "Admin"),
  validateQuerySchema(searchEquipmentSchema),
  equipmentController.index.bind(equipmentController),
);
// #endregion

// #region GET /equipment/:id
/**
 * @openapi
 * /equipment/{id}:
 *   get:
 *     tags:
 *       - Equipment
 *     summary: Buscar equipamento por ID
 *     description: Retorna os dados de um equipamento específico.
 *     operationId: getEquipmentById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do equipamento.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       '200':
 *         description: Equipamento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EquipmentResponse'
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
 *         description: Usuário sem permissão para consultar equipamentos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Equipamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
equipmentRoutes.get(
  "/:id",
  ensureUserRole("N1", "N2", "Admin"),
  equipmentController.show.bind(equipmentController),
);
// #endregion

// #region POST /equipment
/**
 * @openapi
 * /equipment:
 *   post:
 *     tags:
 *       - Equipment
 *     summary: Cadastrar equipamento
 *     description: Cadastra um equipamento e o associa a um local existente.
 *     operationId: createEquipment
 *     requestBody:
 *       required: true
 *       description: Dados necessários para cadastrar o equipamento.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEquipment'
 *           example:
 *             nome: Computador Dell OptiPlex
 *             descricao: Computador utilizado no laboratório.
 *             id_local: 1
 *     responses:
 *       '201':
 *         description: Equipamento cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EquipmentResponse'
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
 *         description: Somente administradores podem cadastrar equipamentos.
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
 *         description: Já existe um equipamento com esse nome.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
equipmentRoutes.post(
  "/",
  ensureUserRole("Admin"),
  validateSchema(createEquipmentSchema),
  equipmentController.store.bind(equipmentController),
);
// #endregion

// #region PUT /equipment/:id
/**
 * @openapi
 * /equipment/{id}:
 *   put:
 *     tags:
 *       - Equipment
 *     summary: Atualizar equipamento
 *     description: Atualiza o nome, a descrição ou o local associado ao equipamento.
 *     operationId: updateEquipment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do equipamento.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEquipment'
 *           example:
 *             nome: Computador Dell OptiPlex atualizado
 *             descricao: Computador atualizado.
 *             id_local: 2
 *     responses:
 *       '200':
 *         description: Equipamento atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EquipmentResponse'
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
 *         description: Somente administradores podem atualizar equipamentos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Equipamento ou local não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Já existe um equipamento com esse nome.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
equipmentRoutes.put(
  "/:id",
  ensureUserRole("Admin"),
  validateSchema(updateEquipmentSchema),
  equipmentController.update.bind(equipmentController),
);
// #endregion

// #region DELETE /equipment/:id
/**
 * @openapi
 * /equipment/{id}:
 *   delete:
 *     tags:
 *       - Equipment
 *     summary: Desativar equipamento
 *     description: Realiza a exclusão lógica do equipamento, alterando seu campo ativo para false.
 *     operationId: deleteEquipment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do equipamento.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       '204':
 *         description: Equipamento desativado com sucesso.
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
 *         description: Somente administradores podem desativar equipamentos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Equipamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
equipmentRoutes.delete(
  "/:id",
  ensureUserRole("Admin"),
  equipmentController.destroy.bind(equipmentController),
);
// #endregion

export default equipmentRoutes;
