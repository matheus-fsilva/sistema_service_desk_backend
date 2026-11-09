import { Repository } from "typeorm";

import database from "../../config/database.config";
import AppError from "../../errors/AppError";

import type { SearchTicketDTO } from "./dto/search-ticket.dto";
import type { CreateTicketDTO } from "./dto/create-ticket.dto";
import type { UpdateTicketDTO } from "./dto/update-ticket.dto";
import type { TicketResponseDTO } from "./dto/ticket-response.dto";

import type { PaginatedResponseDTO } from "../../common/dto/paginated-response.dto";

import Ticket from "./ticket.entity";
import TicketComment from "../ticketComments/ticketComment.entity";
import User from "../users/users.entity";
import Local from "../locals/local.entity";
import Equipment from "../equipment/equipment.entity";

class TicketService {
  // Dependência do repositório
  private get ticketRepository(): Repository<Ticket> {
    return database.getRepository(Ticket);
  }

  private get userRepository(): Repository<User> {
    return database.getRepository(User);
  }

  private get localRepository(): Repository<Local> {
    return database.getRepository(Local);
  }

  private get equipmentRepository(): Repository<Equipment> {
    return database.getRepository(Equipment);
  }

  private get commentRepository(): Repository<TicketComment> {
    return database.getRepository(TicketComment);
  }

  // Listar chamados com filtros, paginação e permissões
  async index(
    searchParams: SearchTicketDTO,
    authenticatedUser: User,
  ): Promise<PaginatedResponseDTO<TicketResponseDTO>> {
    const {
      page,
      limit,
      order,
      titulo,
      tipo,
      status,
      prioridade,
      nivel_atendimento,
      id_solicitante,
      id_local,
      id_tecnico_atribuido,
    } = searchParams;

    const query = this.ticketRepository
      .createQueryBuilder("ticket")
      .leftJoinAndSelect("ticket.solicitante", "solicitante")
      .leftJoinAndSelect("ticket.local", "local")
      .leftJoinAndSelect("ticket.equipamento", "equipamento")
      .leftJoinAndSelect("ticket.tecnico_atribuido", "tecnico_atribuido")
      .leftJoinAndSelect("ticket.tecnico_resolucao", "tecnico_resolucao");

    // Restringir chamados de acordo com o perfil
    if (authenticatedUser.tipo === "Usuario") {
      query.andWhere("solicitante.id = :userId", {
        userId: authenticatedUser.id,
      });
    } else if (authenticatedUser.tipo === "N1") {
      query.andWhere(
        "(ticket.nivel_atendimento = :nivel OR solicitante.id = :userId)",
        {
          nivel: "N1",
          userId: authenticatedUser.id,
        },
      );
    } else if (authenticatedUser.tipo === "N2") {
      query.andWhere(
        "(ticket.nivel_atendimento IN (:...niveis) OR solicitante.id = :userId)",
        {
          niveis: ["N1", "N2"],
          userId: authenticatedUser.id,
        },
      );
    }

    // Aplicar filtros
    if (titulo) {
      query.andWhere("ticket.titulo LIKE :titulo", {
        titulo: `%${titulo}%`,
      });
    }

    if (tipo) {
      query.andWhere("ticket.tipo = :tipo", { tipo });
    }

    if (status) {
      query.andWhere("ticket.status = :status", { status });
    }

    if (prioridade) {
      query.andWhere("ticket.prioridade = :prioridade", { prioridade });
    }

    if (nivel_atendimento) {
      query.andWhere("ticket.nivel_atendimento = :nivelFiltro", {
        nivelFiltro: nivel_atendimento,
      });
    }

    if (id_solicitante) {
      query.andWhere("solicitante.id = :idSolicitante", {
        idSolicitante: id_solicitante,
      });
    }

    if (id_local) {
      query.andWhere("local.id = :idLocal", {
        idLocal: id_local,
      });
    }

    if (id_tecnico_atribuido) {
      query.andWhere("tecnico_atribuido.id = :idTecnico", {
        idTecnico: id_tecnico_atribuido,
      });
    }

    const [tickets, total] = await query
      .orderBy("ticket.id", order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: tickets.map((ticket) => this.toResponseDTO(ticket)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar chamado por ID
  async show(id: number, authenticatedUser: User): Promise<TicketResponseDTO> {
    const ticket = await this.findEntityById(id);

    this.ensureCanAccess(ticket, authenticatedUser);

    return this.toResponseDTO(ticket);
  }

  // Buscar chamado que o usuário tem permissão para gerenciar
  async getManageableTicket(
    id: number,
    authenticatedUser: User,
  ): Promise<Ticket> {
    const ticket = await this.findEntityById(id);

    this.ensureCanManage(ticket, authenticatedUser);

    return ticket;
  }

  // Buscar chamado por ID com relacionamentos
  private async findEntityById(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: {
        solicitante: true,
        local: true,
        equipamento: true,
        tecnico_atribuido: true,
        tecnico_resolucao: true,
      },
    });

    if (!ticket) {
      throw new AppError("Chamado não encontrado.", 404);
    }

    return ticket;
  }

  // Criar chamado
  async store(
    createTicketDTO: CreateTicketDTO,
    authenticatedUser: User,
  ): Promise<TicketResponseDTO> {
    const {
      titulo,
      descricao,
      tipo,
      prioridade,
      id_local,
      id_equipamento,
      nivel_atendimento,
    } = createTicketDTO;

    // Solicitantes não podem escolher o nível de atendimento
    if (
      authenticatedUser.tipo === "Usuario" &&
      nivel_atendimento !== undefined
    ) {
      throw new AppError(
        "Solicitantes não podem definir o nível de atendimento.",
        403,
      );
    }

    // N1, N2 e Admin podem definir o nível inicial
    const nivel =
      authenticatedUser.tipo === "Usuario" ? "N1" : (nivel_atendimento ?? "N1");

    const local = await this.validateLocal(id_local ?? null);

    if (tipo === "Hardware" && !local) {
      throw new AppError(
        "Chamados de Hardware precisam estar associados a um local.",
        400,
      );
    }

    const equipamento = await this.validateEquipment(
      id_equipamento ?? null,
      local,
    );

    const ticket = this.ticketRepository.create({
      solicitante: authenticatedUser,
      local,
      equipamento,
      titulo,
      descricao,
      tipo,
      prioridade,
      nivel_atendimento: nivel,
      status: "Aberto",
      tecnico_atribuido: null,
      tecnico_resolucao: null,
      data_fechamento: null,
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    return this.toResponseDTO(await this.findEntityById(savedTicket.id));
  }

  // Atualizar chamado
  async update(
    id: number,
    updateTicketDTO: UpdateTicketDTO,
    authenticatedUser: User,
  ): Promise<TicketResponseDTO> {
    this.ensureSupportRole(authenticatedUser);

    const ticket = await this.findEntityById(id);

    // Verificar permissão de gerenciamento
    this.ensureCanManage(ticket, authenticatedUser);
    this.ensureTicketIsOpenForChanges(ticket);

    const {
      titulo,
      descricao,
      tipo,
      prioridade,
      status,
      nivel_atendimento,
      id_local,
      id_equipamento,
      id_tecnico_atribuido,
    } = updateTicketDTO;

    if (titulo !== undefined) ticket.titulo = titulo;
    if (descricao !== undefined) ticket.descricao = descricao;
    if (tipo !== undefined) ticket.tipo = tipo;
    if (prioridade !== undefined) ticket.prioridade = prioridade;

    if (nivel_atendimento !== undefined) {
      ticket.nivel_atendimento = nivel_atendimento;
    }

    // Atualizar ou validar o técnico atribuído
    if (id_tecnico_atribuido !== undefined) {
      ticket.tecnico_atribuido =
        id_tecnico_atribuido === null
          ? null
          : await this.validateTechnician(
              id_tecnico_atribuido,
              ticket.nivel_atendimento,
            );
    } else if (ticket.tecnico_atribuido) {
      // Revalidar o técnico atual caso o nível tenha sido alterado
      ticket.tecnico_atribuido = await this.validateTechnician(
        ticket.tecnico_atribuido.id,
        ticket.nivel_atendimento,
      );
    }

    if (id_local !== undefined) {
      ticket.local = await this.validateLocal(id_local);
    }

    if (id_equipamento !== undefined) {
      const local = ticket.local;

      ticket.equipamento = await this.validateEquipment(id_equipamento, local);
    } else if (id_local !== undefined && ticket.equipamento) {
      // Impedir que o equipamento fique associado a outro local
      ticket.equipamento = await this.validateEquipment(
        ticket.equipamento.id,
        ticket.local,
      );
    }

    if (ticket.tipo === "Hardware" && !ticket.local) {
      throw new AppError(
        "Chamados de Hardware precisam estar associados a um local.",
        400,
      );
    }

    if (status !== undefined) {
      ticket.status = status;

      if (status === "Fechado") {
        ticket.data_fechamento = new Date();
        ticket.tecnico_resolucao = authenticatedUser;
      } else {
        ticket.data_fechamento = null;
        ticket.tecnico_resolucao = null;
      }
    }

    const updatedTicket = await this.ticketRepository.save(ticket);

    return this.toResponseDTO(await this.findEntityById(updatedTicket.id));
  }

  // Cancelar chamado com justificativa e transação
  async cancel(
    id: number,
    justificativa: string,
    authenticatedUser: User,
  ): Promise<TicketResponseDTO> {
    if (!justificativa.trim()) {
      throw new AppError("Informe a justificativa do cancelamento.", 400);
    }

    return database.transaction(async (manager) => {
      // Repositórios vinculados à transação
      const ticketRepository = manager.getRepository(Ticket);
      const commentRepository = manager.getRepository(TicketComment);

      // Buscar chamado com bloqueio durante a transação
      const ticket = await ticketRepository.findOne({
        where: { id },
        relations: {
          solicitante: true,
          local: true,
          equipamento: true,
          tecnico_atribuido: true,
          tecnico_resolucao: true,
        },
        lock: { mode: "pessimistic_write" },
      });

      if (!ticket) {
        throw new AppError("Chamado não encontrado.", 404);
      }

      // Validar permissão de gerenciamento
      this.ensureCanManage(ticket, authenticatedUser);

      if (ticket.status === "Fechado" || ticket.status === "Cancelado") {
        throw new AppError(
          "Não é possível cancelar um chamado fechado ou já cancelado.",
          400,
        );
      }

      if (authenticatedUser.tipo === "Usuario" && ticket.status !== "Aberto") {
        throw new AppError(
          "Você só pode cancelar chamados que estejam abertos. Para chamados em andamento, solicite o cancelamento ao suporte.",
          403,
        );
      }

      // Atualizar o chamado
      ticket.status = "Cancelado";
      ticket.data_fechamento = new Date();

      await ticketRepository.save(ticket);

      // Registrar a justificativa como comentário público
      const comment = commentRepository.create({
        chamado: ticket,
        usuario: authenticatedUser,
        comentario: `Cancelamento do chamado. Justificativa: ${justificativa.trim()}`,
      });

      await commentRepository.save(comment);

      return this.toResponseDTO(ticket);
    });
  }

  // Validar acesso para visualização do chamado
  private ensureCanAccess(ticket: Ticket, user: User): void {
    if (user.tipo === "Admin") return;

    // O solicitante só acessa os próprios chamados
    if (user.tipo === "Usuario" && ticket.solicitante.id !== user.id) {
      throw new AppError("Você não possui acesso a este chamado.", 403);
    }

    // N1 acessa chamados N1 e aqueles que abriu
    if (
      user.tipo === "N1" &&
      ticket.nivel_atendimento !== "N1" &&
      ticket.solicitante.id !== user.id
    ) {
      throw new AppError("Você não possui acesso a este chamado.", 403);
    }

    // N2 acessa chamados N1, N2 e aqueles que abriu
    if (
      user.tipo === "N2" &&
      !["N1", "N2"].includes(ticket.nivel_atendimento) &&
      ticket.solicitante.id !== user.id
    ) {
      throw new AppError("Você não possui acesso a este chamado.", 403);
    }
  }

  // Validar permissão para gerenciar o chamado
  private ensureCanManage(ticket: Ticket, user: User): void {
    if (user.tipo === "Admin") return;

    // Solicitante só pode gerenciar os próprios chamados
    if (user.tipo === "Usuario") {
      if (ticket.solicitante.id !== user.id) {
        throw new AppError(
          "Você não possui permissão para gerenciar este chamado.",
          403,
        );
      }

      return;
    }

    // N1 só gerencia chamados do nível N1
    if (user.tipo === "N1" && ticket.nivel_atendimento !== "N1") {
      throw new AppError(
        "Você não possui permissão para gerenciar chamados deste nível.",
        403,
      );
    }

    // N2 gerencia chamados dos níveis N1 e N2
    if (
      user.tipo === "N2" &&
      !["N1", "N2"].includes(ticket.nivel_atendimento)
    ) {
      throw new AppError(
        "Você não possui permissão para gerenciar chamados deste nível.",
        403,
      );
    }
  }

  // Validar perfil de suporte
  private ensureSupportRole(user: User): void {
    if (!["N1", "N2", "Admin"].includes(user.tipo)) {
      throw new AppError(
        "Você não possui permissão para realizar esta operação.",
        403,
      );
    }
  }

  // Impedir alterações em chamados encerrados
  private ensureTicketIsOpenForChanges(ticket: Ticket): void {
    if (ticket.status === "Fechado" || ticket.status === "Cancelado") {
      throw new AppError(
        "Não é possível alterar um chamado fechado ou cancelado.",
        400,
      );
    }
  }

  // Validar local
  private async validateLocal(id: number | null): Promise<Local | null> {
    if (id === null) return null;

    const local = await this.localRepository.findOneBy({
      id,
      ativo: true,
    });

    if (!local) {
      throw new AppError("Local não encontrado ou inativo.", 404);
    }

    return local;
  }

  // Validar equipamento e seu local
  private async validateEquipment(
    id: number | null,
    local: Local | null,
  ): Promise<Equipment | null> {
    if (id === null) return null;

    const equipment = await this.equipmentRepository.findOne({
      where: {
        id,
        ativo: true,
      },
      relations: {
        local: true,
      },
    });

    if (!equipment) {
      throw new AppError("Equipamento não encontrado ou inativo.", 404);
    }

    if (!local || equipment.local.id !== local.id) {
      throw new AppError(
        "O equipamento informado não pertence ao local selecionado.",
        400,
      );
    }

    return equipment;
  }

  // Validar técnico atribuído
  private async validateTechnician(
    id: number,
    nivel: "N1" | "N2",
  ): Promise<User> {
    const technician = await this.userRepository.findOneBy({
      id,
      ativo: true,
    });

    if (!technician || !["N1", "N2"].includes(technician.tipo)) {
      throw new AppError(
        "Técnico não encontrado, inativo ou sem perfil de suporte.",
        404,
      );
    }

    if (nivel === "N2" && technician.tipo !== "N2") {
      throw new AppError(
        "Chamados de nível N2 só podem ser atribuídos a técnicos N2.",
        400,
      );
    }

    return technician;
  }

  // Converter entidade para DTO de resposta
  private toResponseDTO(ticket: Ticket): TicketResponseDTO {
    return {
      id: ticket.id,
      id_solicitante: ticket.solicitante.id,
      id_local: ticket.local?.id ?? null,
      id_equipamento: ticket.equipamento?.id ?? null,
      id_tecnico_atribuido: ticket.tecnico_atribuido?.id ?? null,
      id_tecnico_resolucao: ticket.tecnico_resolucao?.id ?? null,
      titulo: ticket.titulo,
      descricao: ticket.descricao,
      tipo: ticket.tipo,
      status: ticket.status,
      prioridade: ticket.prioridade,
      nivel_atendimento: ticket.nivel_atendimento,
      data_abertura: ticket.data_abertura,
      data_fechamento: ticket.data_fechamento,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
    };
  }
}

export default new TicketService();
