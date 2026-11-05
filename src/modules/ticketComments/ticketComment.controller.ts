import type { Request, Response } from "express";

import parseId from "../../utils/parseId";
import AppError from "../../errors/AppError";

import ticketCommentService from "./ticketComment.service";

import type { CreateTicketCommentDTO } from "./dto/create-ticket-comment.dto";

import type User from "../users/users.entity";

class TicketCommentController {
  // Obter usuário autenticado
  private getAuthenticatedUser(req: Request): User {
    if (!req.user) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    return req.user;
  }

  // Listar comentários de um chamado
  async index(req: Request, res: Response): Promise<void> {
    const ticketId = parseId(req.params.ticketId);
    const authenticatedUser = this.getAuthenticatedUser(req);

    const comments = await ticketCommentService.index(
      ticketId,
      authenticatedUser,
    );

    res.status(200).json(comments);
  }

  // Criar comentário em um chamado
  async store(req: Request, res: Response): Promise<void> {
    const ticketId = parseId(req.params.ticketId);
    const authenticatedUser = this.getAuthenticatedUser(req);

    const comment = await ticketCommentService.store(
      ticketId,
      req.body as CreateTicketCommentDTO,
      authenticatedUser,
    );

    res.status(201).json(comment);
  }
}

export default new TicketCommentController();
