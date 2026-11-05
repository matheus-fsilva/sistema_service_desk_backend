import { Router } from "express";

import ticketController from "./ticket.controller";

import validateSchema from "../../middlewares/validateSchema";
import validateQuerySchema from "../../middlewares/validateQuerySchema";
import authMiddleware from "../../middlewares/authMiddleware";
import ensureUserRole from "../../middlewares/ensureUserRole";

import { createTicketSchema } from "./dto/create-ticket.dto";
import { updateTicketSchema } from "./dto/update-ticket.dto";
import { searchTicketSchema } from "./dto/search-ticket.dto";
import { cancelTicketSchema } from "./dto/cancel-ticket.dto";

const ticketRoutes = Router();

ticketRoutes.use(authMiddleware);

// #region GET /tickets
/**
 * @openapi
 * /tickets:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Listar chamados
 *     description: >
 *       Lista os chamados de acordo com o perfil do usuário autenticado,
 *       permitindo filtros, paginação e ordenação.
 *       Usuários consultam apenas seus próprios chamados.
 *       N1 consulta chamados do nível N1 e seus próprios chamados.
 *       N2 consulta chamados dos níveis N1 e N2 e seus próprios chamados.
 *       Admin possui acesso a todos os chamados.
 *     operationId: indexTickets
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: false
 *         schema:
 *           type: string
 *         description: Trecho do título utilizado para filtrar os chamados.
 *         example: Problema no computador
 *       - in: query
 *         name: tipo
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Hardware, Software]
 *         description: Tipo do chamado.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Aberto, Em andamento, Fechado, Cancelado]
 *         description: Status atual do chamado.
 *       - in: query
 *         name: prioridade
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Baixa, Média, Alta, Crítica]
 *         description: Prioridade do chamado.
 *       - in: query
 *         name: nivel_atendimento
 *         required: false
 *         schema:
 *           type: string
 *           enum: [N1, N2]
 *         description: Nível de atendimento do chamado.
 *       - in: query
 *         name: id_solicitante
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador do usuário solicitante.
 *       - in: query
 *         name: id_local
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador do local relacionado ao chamado.
 *       - in: query
 *         name: id_tecnico_atribuido
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador do técnico atualmente atribuído.
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
 *         description: Ordenação dos chamados pelo identificador.
 *     responses:
 *       '200':
 *         description: Chamados listados com sucesso.
 *       '400':
 *         description: Parâmetros de consulta inválidos.
 *       '401':
 *         description: Usuário não autenticado.
 */
ticketRoutes.get(
  "/",
  ensureUserRole("Usuario", "N1", "N2", "Admin"),
  validateQuerySchema(searchTicketSchema),
  ticketController.index.bind(ticketController),
);
// #endregion

// #region GET /tickets/:id
/**
 * @openapi
 * /tickets/{id}:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Buscar chamado por ID
 *     description: >
 *       Retorna os dados de um chamado específico, respeitando as regras
 *       de acesso do perfil do usuário autenticado.
 *     operationId: getTicketById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do chamado.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       '200':
 *         description: Chamado encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketResponse'
 *       '400':
 *         description: Identificador inválido.
 *       '401':
 *         description: Usuário não autenticado.
 *       '403':
 *         description: Usuário não possui permissão para visualizar este chamado.
 *       '404':
 *         description: Chamado não encontrado.
 */
ticketRoutes.get(
  "/:id",
  ensureUserRole("Usuario", "N1", "N2", "Admin"),
  ticketController.show.bind(ticketController),
);
// #endregion

// #region POST /tickets
/**
 * @openapi
 * /tickets:
 *   post:
 *     tags:
 *       - Tickets
 *     summary: Criar chamado
 *     description: >
 *       Cadastra um novo chamado. O solicitante é definido automaticamente
 *       pelo usuário autenticado. Chamados criados por usuários comuns
 *       são encaminhados inicialmente ao nível N1. Usuários de suporte
 *       e administradores podem definir o nível inicial.
 *     operationId: createTicket
 *     requestBody:
 *       required: true
 *       description: Dados necessários para cadastrar o chamado.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicket'
 *           example:
 *             titulo: Computador não liga
 *             descricao: O computador do laboratório não está ligando.
 *             tipo: Hardware
 *             prioridade: Média
 *             id_local: 1
 *             id_equipamento: 1
 *     responses:
 *       '201':
 *         description: Chamado criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketResponse'
 *       '400':
 *         description: Dados inválidos ou incompatíveis.
 *       '401':
 *         description: Usuário não autenticado.
 *       '404':
 *         description: Local ou equipamento não encontrado.
 *       '409':
 *         description: Conflito com os dados informados.
 */
ticketRoutes.post(
  "/",
  ensureUserRole("Usuario", "N1", "N2", "Admin"),
  validateSchema(createTicketSchema),
  ticketController.store.bind(ticketController),
);
// #endregion

// #region PUT /tickets/:id
/**
 * @openapi
 * /tickets/{id}:
 *   put:
 *     tags:
 *       - Tickets
 *     summary: Atualizar chamado
 *     description: >
 *       Atualiza os dados de um chamado. Operação disponível para N1,
 *       N2 e Admin, respeitando as permissões de gerenciamento de cada nível.
 *       Chamados fechados ou cancelados não podem ser alterados.
 *     operationId: updateTicket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do chamado.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       description: Campos que serão atualizados no chamado.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTicket'
 *           example:
 *             prioridade: Alta
 *             status: Em andamento
 *             id_tecnico_atribuido: 2
 *     responses:
 *       '200':
 *         description: Chamado atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketResponse'
 *       '400':
 *         description: Dados inválidos ou chamado não pode ser alterado.
 *       '401':
 *         description: Usuário não autenticado.
 *       '403':
 *         description: Usuário não possui permissão para gerenciar este chamado.
 *       '404':
 *         description: Chamado, local, equipamento ou técnico não encontrado.
 */
ticketRoutes.put(
  "/:id",
  ensureUserRole("N1", "N2", "Admin"),
  validateSchema(updateTicketSchema),
  ticketController.update.bind(ticketController),
);
// #endregion

// #region PATCH /tickets/:id/cancel
/**
 * @openapi
 * /tickets/{id}/cancel:
 *   patch:
 *     tags:
 *       - Tickets
 *     summary: Cancelar chamado
 *     description: >
 *       Cancela um chamado mediante justificativa.
 *       Usuários comuns podem cancelar seus próprios chamados enquanto
 *       estiverem abertos. N1 e N2 podem cancelar chamados que podem gerenciar.
 *       Admin pode cancelar qualquer chamado. A justificativa é registrada
 *       automaticamente como comentário do chamado.
 *     operationId: cancelTicket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único do chamado.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       description: Justificativa para o cancelamento do chamado.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelTicket'
 *           example:
 *             justificativa: A solicitação não é mais necessária.
 *     responses:
 *       '200':
 *         description: Chamado cancelado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketResponse'
 *       '400':
 *         description: Justificativa inválida ou chamado não pode ser cancelado.
 *       '401':
 *         description: Usuário não autenticado.
 *       '403':
 *         description: Usuário não possui permissão para cancelar este chamado.
 *       '404':
 *         description: Chamado não encontrado.
 */
ticketRoutes.patch(
  "/:id/cancel",
  ensureUserRole("Usuario", "N1", "N2", "Admin"),
  validateSchema(cancelTicketSchema),
  ticketController.cancel.bind(ticketController),
);
// #endregion

export default ticketRoutes;
