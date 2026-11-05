import { Repository } from "typeorm";

import database from "../../config/database.config";
import AppError from "../../errors/AppError";

import type { CreateTicketCommentDTO } from "./dto/create-ticket-comment.dto";
import type { TicketCommentResponseDTO } from "./dto/ticket-comment-response.dto";

import TicketComment from "./ticketComment.entity";
import User from "../users/users.entity";

import ticketService from "../tickets/ticket.service";

class TicketCommentService {
  // Dependência do repositório
  private get commentRepository(): Repository<TicketComment> {
    return database.getRepository(TicketComment);
  }

  // Listar comentários de um chamado
  async index(
    ticketId: number,
    authenticatedUser: User,
  ): Promise<TicketCommentResponseDTO[]> {
    // Verificar se o usuário pode acessar o chamado
    await ticketService.show(ticketId, authenticatedUser);

    const comments = await this.commentRepository.find({
      where: {
        chamado: {
          id: ticketId,
        },
      },
      relations: {
        usuario: true,
      },
      order: {
        created_at: "ASC",
      },
    });

    return comments.map((comment) => this.toResponseDTO(comment));
  }

  // Criar comentário
  async store(
    ticketId: number,
    createTicketCommentDTO: CreateTicketCommentDTO,
    authenticatedUser: User,
  ): Promise<TicketCommentResponseDTO> {
    // Verificar se o usuário pode gerenciar o chamado
    const ticket = await ticketService.getManageableTicket(
      ticketId,
      authenticatedUser,
    );

    if (ticket.status === "Fechado" || ticket.status === "Cancelado") {
      throw new AppError(
        "Não é possível comentar em um chamado fechado ou cancelado.",
        400,
      );
    }

    const comment = this.commentRepository.create({
      chamado: ticket,
      usuario: authenticatedUser,
      comentario: createTicketCommentDTO.comentario,
    });

    const savedComment = await this.commentRepository.save(comment);

    const commentWithRelations = await this.commentRepository.findOne({
      where: {
        id: savedComment.id,
      },
      relations: {
        chamado: true,
        usuario: true,
      },
    });

    if (!commentWithRelations) {
      throw new AppError("Erro ao registrar o comentário.", 500);
    }

    return this.toResponseDTO(commentWithRelations);
  }

  // Converter entidade para DTO de resposta
  private toResponseDTO(comment: TicketComment): TicketCommentResponseDTO {
    return {
      id: comment.id,
      id_chamado: comment.chamado.id,
      id_usuario: comment.usuario.id,
      comentario: comment.comentario,
      created_at: comment.created_at,
    };
  }
}

export default new TicketCommentService();
