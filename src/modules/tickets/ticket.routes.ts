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
 *
 *       Regras de acesso:
 *       - Usuario: consulta somente os próprios chamados.
 *       - N1: consulta chamados do nível N1 e seus próprios chamados.
 *       - N2: consulta chamados dos níveis N1 e N2 e seus próprios chamados.
 *       - Admin: consulta todos os chamados.
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
 *         example: 2
 *       - in: query
 *         name: id_local
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador do local relacionado ao chamado.
 *         example: 1
 *       - in: query
 *         name: id_tecnico_atribuido
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador do técnico atualmente atribuído.
 *         example: 3
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketListResponse'
 *             example:
 *               status: success
 *               message: Chamados listados com sucesso.
 *               data:
 *                 - id: 1
 *                   id_solicitante: 2
 *                   id_local: 1
 *                   id_equipamento: 1
 *                   id_tecnico_atribuido: 3
 *                   id_tecnico_resolucao: null
 *                   titulo: Computador não liga
 *                   descricao: O computador do laboratório não está ligando.
 *                   tipo: Hardware
 *                   status: Aberto
 *                   prioridade: Média
 *                   nivel_atendimento: N1
 *                   data_abertura: '2026-11-06T12:00:00.000Z'
 *                   data_fechamento: null
 *                   created_at: '2026-11-06T12:00:00.000Z'
 *                   updated_at: '2026-11-06T12:00:00.000Z'
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 25
 *                 totalPages: 3
 *       '400':
 *         description: Parâmetros de consulta inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 400
 *               message: Os dados enviados são inválidos.
 *               errors:
 *                 - field: page
 *                   message: A página deve ser um número inteiro positivo.
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 401
 *               message: Usuário não autenticado.
 *               errors: []
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
 *
 *       Usuários consultam somente os próprios chamados.
 *       N1 consulta chamados N1 e os próprios chamados N2.
 *       N2 consulta chamados N1, N2 e os próprios chamados.
 *       Admin possui acesso irrestrito.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 400
 *               message: ID inválido.
 *               errors: []
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 401
 *               message: Usuário não autenticado.
 *               errors: []
 *       '403':
 *         description: Usuário não possui permissão para visualizar este chamado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 403
 *               message: Você não possui permissão para realizar esta operação.
 *               errors: []
 *       '404':
 *         description: Chamado não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 404
 *               message: Chamado não encontrado.
 *               errors: []
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
 *       Cadastra um novo chamado.
 *
 *       O solicitante é definido automaticamente pelo usuário autenticado.
 *       Não é necessário informar o identificador do solicitante.
 *
 *       Chamados criados por usuários comuns são encaminhados inicialmente
 *       ao nível N1. N1, N2 e Admin podem definir o nível inicial.
 *
 *       Para chamados do tipo Hardware, o local é obrigatório.
 *       O equipamento informado deve pertencer ao local selecionado.
 *       Para chamados do tipo Software, o local é opcional.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 400
 *               message: Os dados enviados são inválidos.
 *               errors:
 *                 - field: titulo
 *                   message: O título não pode ultrapassar 150 caracteres.
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 401
 *               message: Usuário não autenticado.
 *               errors: []
 *       '404':
 *         description: Local ou equipamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 404
 *               message: Local ou equipamento não encontrado.
 *               errors: []
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
 *       Atualiza os dados de um chamado.
 *
 *       Operação disponível para N1, N2 e Admin, respeitando as permissões
 *       de gerenciamento de cada nível.
 *
 *       N1 gerencia chamados N1. N2 gerencia chamados N1 e N2.
 *       Admin pode gerenciar todos os chamados.
 *
 *       É necessário informar pelo menos um campo para atualização.
 *       Chamados fechados ou cancelados não podem ser alterados.
 *       O encerramento registra automaticamente o técnico responsável
 *       e a data de fechamento.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 400
 *               message: Os dados enviados são inválidos.
 *               errors:
 *                 - field: prioridade
 *                   message: Informe uma prioridade válida.
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 401
 *               message: Usuário não autenticado.
 *               errors: []
 *       '403':
 *         description: Usuário não possui permissão para gerenciar este chamado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 403
 *               message: Você não possui permissão para realizar esta operação.
 *               errors: []
 *       '404':
 *         description: Chamado, local, equipamento ou técnico não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 404
 *               message: Chamado não encontrado.
 *               errors: []
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
 *
 *       Usuários comuns podem cancelar seus próprios chamados enquanto
 *       estiverem abertos.
 *
 *       N1 e N2 podem cancelar chamados que possuem permissão para gerenciar.
 *       Admin pode cancelar qualquer chamado.
 *
 *       A justificativa é registrada automaticamente como comentário
 *       do chamado. Chamados fechados ou já cancelados não podem
 *       ser cancelados novamente.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 400
 *               message: Os dados enviados são inválidos.
 *               errors:
 *                 - field: justificativa
 *                   message: A justificativa não pode ficar vazia.
 *       '401':
 *         description: Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 401
 *               message: Usuário não autenticado.
 *               errors: []
 *       '403':
 *         description: Usuário não possui permissão para cancelar este chamado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 403
 *               message: Você não possui permissão para realizar esta operação.
 *               errors: []
 *       '404':
 *         description: Chamado não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               statusCode: 404
 *               message: Chamado não encontrado.
 *               errors: []
 */
ticketRoutes.patch(
  "/:id/cancel",
  ensureUserRole("Usuario", "N1", "N2", "Admin"),
  validateSchema(cancelTicketSchema),
  ticketController.cancel.bind(ticketController),
);
// #endregion

export default ticketRoutes;
