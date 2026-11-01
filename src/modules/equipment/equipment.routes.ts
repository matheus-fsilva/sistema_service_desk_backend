import { Router } from "express";

import equipmentController from "./equipment.controller";

import validateSchema from "../../middlewares/validateSchema";
import validateQuerySchema from "../../middlewares/validateQuerySchema";

import { createEquipmentSchema } from "./dto/create-equipment.dto";
import { updateEquipmentSchema } from "./dto/update-equipment.dto";
import { searchEquipmentSchema } from "./dto/search-equipment.dto";

const equipmentRoutes = Router();

// #region GET /equipment
/**
 * @openapi
 * /equipment:
 *   get:
 *     tags:
 *       - Equipment
 *     summary: Listar equipamentos
 *     description: Lista os equipamentos com busca por nome, paginação e ordenação por identificador.
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
 *       '400':
 *         description: Parâmetros de consulta inválidos.
 */
equipmentRoutes.get(
  "/",
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
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Equipamento não encontrado.
 */
equipmentRoutes.get("/:id", equipmentController.show.bind(equipmentController));
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
 *       '400':
 *         description: Dados da requisição inválidos.
 *       '404':
 *         description: Local não encontrado.
 *       '409':
 *         description: Já existe um equipamento com esse nome.
 */
equipmentRoutes.post(
  "/",
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
 *       '400':
 *         description: Dados inválidos ou identificador inválido.
 *       '404':
 *         description: Equipamento ou local não encontrado.
 *       '409':
 *         description: Já existe um equipamento com esse nome.
 */
equipmentRoutes.put(
  "/:id",
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
 *     summary: Excluir equipamento
 *     description: Exclui um equipamento pelo seu identificador.
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
 *         description: Equipamento excluído com sucesso.
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Equipamento não encontrado.
 */
equipmentRoutes.delete(
  "/:id",
  equipmentController.destroy.bind(equipmentController),
);
// #endregion

export default equipmentRoutes;
