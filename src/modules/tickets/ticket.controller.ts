import type { Request, Response } from "express";

import parseId from "../../utils/parseId";
import AppError from "../../errors/AppError";

import ticketService from "./ticket.service";

import type { SearchTicketDTO } from "./dto/search-ticket.dto";
import type { CreateTicketDTO } from "./dto/create-ticket.dto";
import type { UpdateTicketDTO } from "./dto/update-ticket.dto";
import type { CancelTicketDTO } from "./dto/cancel-ticket.dto";

import sendPaginatedListResponse from "../../common/responses/send-paginated-list-response";

import type User from "../users/users.entity";

class TicketController {
  // Obter usuário autenticado
  private getAuthenticatedUser(req: Request): User {
    if (!req.user) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    return req.user;
  }

  // Listar chamados com busca, paginação e ordenação
  async index(req: Request, res: Response): Promise<void> {
    const searchParams = res.locals.validatedQuery as SearchTicketDTO;
    const authenticatedUser = this.getAuthenticatedUser(req);

    const result = await ticketService.index(searchParams, authenticatedUser);

    sendPaginatedListResponse(
      res,
      result.data,
      result.pagination,
      "Chamados listados com sucesso.",
    );
  }

  // Buscar chamado por ID
  async show(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    const authenticatedUser = this.getAuthenticatedUser(req);

    const ticket = await ticketService.show(id, authenticatedUser);

    res.status(200).json(ticket);
  }

  // Criar chamado
  async store(req: Request, res: Response): Promise<void> {
    const authenticatedUser = this.getAuthenticatedUser(req);

    const ticket = await ticketService.store(
      req.body as CreateTicketDTO,
      authenticatedUser,
    );

    res.status(201).json(ticket);
  }

  // Atualizar chamado por ID
  async update(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    const authenticatedUser = this.getAuthenticatedUser(req);

    const ticket = await ticketService.update(
      id,
      req.body as UpdateTicketDTO,
      authenticatedUser,
    );

    res.status(200).json(ticket);
  }

  // Cancelar chamado por ID
  async cancel(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    const authenticatedUser = this.getAuthenticatedUser(req);

    const { justificativa } = req.body as CancelTicketDTO;

    const ticket = await ticketService.cancel(
      id,
      justificativa,
      authenticatedUser,
    );

    res.status(200).json(ticket);
  }
}

export default new TicketController();
