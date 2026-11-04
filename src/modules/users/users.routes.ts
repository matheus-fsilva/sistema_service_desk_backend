import { Router } from "express";

import userController from "./users.controller";

import validateSchema from "../../middlewares/validateSchema";
import validateQuerySchema from "../../middlewares/validateQuerySchema";
import authMiddleware from "../../middlewares/authMiddleware";
import ensureUserRole from "../../middlewares/ensureUserRole";

import { createUserSchema } from "./dto/create-user.dto";
import { updateUserSchema } from "./dto/update-user.dto";
import { searchUserSchema } from "./dto/search-user.dto";

const userRoutes = Router();

userRoutes.use(authMiddleware);

// #region GET /users
/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar usuários
 *     description: Lista os usuários com filtros, paginação e ordenação por identificador.
 *     operationId: indexUsers
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *         description: Trecho do nome utilizado para filtrar os usuários.
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *         description: Trecho do e-mail utilizado para filtrar os usuários.
 *       - in: query
 *         name: tipo
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Usuario, N1, N2, Admin]
 *         description: Tipo de usuário.
 *       - in: query
 *         name: ativo
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filtra usuários ativos ou inativos.
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
 *         description: Ordenação dos usuários pelo identificador.
 *     responses:
 *       '200':
 *         description: Usuários listados com sucesso.
 *       '400':
 *         description: Parâmetros de consulta inválidos.
 */
userRoutes.get(
  "/",
  ensureUserRole("N1", "N2", "Admin"),
  validateQuerySchema(searchUserSchema),
  userController.index.bind(userController),
);
// #endregion

// #region GET /users/:id
/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Buscar usuário por ID
 *     description: Retorna os dados de um usuário específico, sem expor sua senha.
 *     operationId: getUserById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do usuário.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       '200':
 *         description: Usuário encontrado.
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Usuário não encontrado.
 */
userRoutes.get(
  "/:id",
  ensureUserRole("N1", "N2", "Admin"),
  userController.show.bind(userController),
);
// #endregion

// #region POST /users
/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Cadastrar usuário
 *     description: Cadastra um usuário e armazena sua senha utilizando hash.
 *     operationId: createUser
 *     requestBody:
 *       required: true
 *       description: Dados necessários para cadastrar o usuário.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *           example:
 *             nome: João da Silva
 *             email: joao@exemplo.com
 *             senha: Senha123!
 *             tipo: Usuario
 *     responses:
 *       '201':
 *         description: Usuário cadastrado com sucesso.
 *       '400':
 *         description: Dados da requisição inválidos.
 *       '409':
 *         description: E-mail já cadastrado.
 */
userRoutes.post(
  "/",
  ensureUserRole("Admin"),
  validateSchema(createUserSchema),
  userController.store.bind(userController),
);
// #endregion

// #region PUT /users/:id
/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Atualizar usuário
 *     description: Atualiza os dados de um usuário. A senha é opcional e, quando informada, será armazenada com hash.
 *     operationId: updateUser
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do usuário.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *           example:
 *             nome: João da Silva atualizado
 *             email: joao.atualizado@exemplo.com
 *             tipo: Usuario
 *             ativo: true
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso.
 *       '400':
 *         description: Dados inválidos ou identificador inválido.
 *       '404':
 *         description: Usuário não encontrado.
 *       '409':
 *         description: E-mail já cadastrado.
 */
userRoutes.put(
  "/:id",
  ensureUserRole("Admin"),
  validateSchema(updateUserSchema),
  userController.update.bind(userController),
);
// #endregion

// #region DELETE /users/:id
/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Excluir usuário
 *     description: Exclui um usuário pelo seu identificador.
 *     operationId: deleteUser
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do usuário.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       '204':
 *         description: Usuário excluído com sucesso.
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Usuário não encontrado.
 */
userRoutes.delete(
  "/:id",
  ensureUserRole("Admin"),
  userController.destroy.bind(userController),
);
// #endregion

export default userRoutes;
