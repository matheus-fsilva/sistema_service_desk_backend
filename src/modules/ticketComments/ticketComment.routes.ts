import { Router } from "express";

import ticketCommentController from "./ticketComment.controller";

import validateSchema from "../../middlewares/validateSchema";
import authMiddleware from "../../middlewares/authMiddleware";
import ensureUserRole from "../../middlewares/ensureUserRole";

import { createTicketCommentSchema } from "./dto/create-ticket-comment.dto";

const ticketCommentRoutes = Router();

ticketCommentRoutes.use(authMiddleware);

// #region GET /tickets/:ticketId/comments
/**
 * @openapi
 * /tickets/{ticketId}/comments:
 *   get:
 *     tags:
 *       - Ticket Comments
 *     summary: Listar comentários de um chamado
 *     description: >
 *       Retorna os comentários de um chamado específico,
 *       respeitando as permissões de visualização do usuário autenticado.
 *       Os comentários são apresentados em ordem cronológica.
 *     operationId: indexTicketComments
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: Identificador único do chamado.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       '200':
 *         description: Comentários listados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketCommentResponse'
 *             example:
 *               - id: 1
 *                 id_chamado: 1
 *                 id_usuario: 2
 *                 comentario: O suporte está verificando o problema.
 *                 created_at: '2026-10-27T14:30:00.000Z'
 *       '400':
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Usuário não autenticado.
 *       '403':
 *         description: Usuário não possui permissão para visualizar este chamado.
 *       '404':
 *         description: Chamado não encontrado.
 */
ticketCommentRoutes.get(
  "/:ticketId/comments",
  ensureUserRole("Usuario", "N1", "N2", "Admin"),
  ticketCommentController.index.bind(ticketCommentController),
);
// #endregion

// #region POST /tickets/:ticketId/comments
/**
 * @openapi
 * /tickets/{ticketId}/comments:
 *   post:
 *     tags:
 *       - Ticket Comments
 *     summary: Criar comentário em um chamado
 *     description: >
 *       Registra um comentário em um chamado específico.
 *       O usuário responsável pelo comentário é identificado automaticamente
 *       pelo token de autenticação.
 *       Não é permitido comentar em chamados fechados ou cancelados.
 *     operationId: createTicketComment
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: Identificador único do chamado.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       description: Dados necessários para registrar o comentário.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketComment'
 *           example:
 *             comentario: O problema continua acontecendo após reiniciar o computador.
 *     responses:
 *       '201':
 *         description: Comentário registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketCommentResponse'
 *             example:
 *               id: 2
 *               id_chamado: 1
 *               id_usuario: 2
 *               comentario: O problema continua acontecendo após reiniciar o computador.
 *               created_at: '2026-10-27T15:00:00.000Z'
 *       '400':
 *         description: Comentário inválido ou chamado fechado ou cancelado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Usuário não autenticado.
 *       '403':
 *         description: Usuário não possui permissão para comentar neste chamado.
 *       '404':
 *         description: Chamado não encontrado.
 */
ticketCommentRoutes.post(
  "/:ticketId/comments",
  ensureUserRole("Usuario", "N1", "N2", "Admin"),
  validateSchema(createTicketCommentSchema),
  ticketCommentController.store.bind(ticketCommentController),
);
// #endregion

export default ticketCommentRoutes;
