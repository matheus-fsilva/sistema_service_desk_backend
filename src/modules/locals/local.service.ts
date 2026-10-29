import { Repository } from "typeorm";
import database from "../../config/database.config";
import AppError from "../../errors/AppError";

import type { CreateLocalDTO } from "./dto/create-local.dto";
import type { LocalResponseDTO } from "./dto/local-response.dto";
import type { UpdateLocalDTO } from "./dto/update-local.dto";

import type { SearchParamsDTO } from "../../common/dto/search-params.dto";
import type { PaginatedResponseDTO } from "../../common/dto/paginated-response.dto";

import Local from "./local.entity";

class LocalService {
  // Dependência do repositório
  private get localRepository(): Repository<Local> {
    return database.getRepository(Local);
  }

  // Listar locais com paginação e ordenação
  async index(
    searchParams: SearchParamsDTO,
  ): Promise<PaginatedResponseDTO<LocalResponseDTO>> {
    const { page, limit, order } = searchParams;

    const [locals, total] = await this.localRepository.findAndCount({
      order: {
        id: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: locals.map((local) => this.toResponseDTO(local)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar local por ID
  async show(id: number): Promise<LocalResponseDTO> {
    const local = await this.findEntityById(id);

    return this.toResponseDTO(local);
  }

  // Buscar local por ID (sem padrão de resposta)
  private async findEntityById(id: number): Promise<Local> {
    const local = await this.localRepository.findOneBy({ id });

    if (!local) {
      throw new AppError("Local não encontrado.", 404);
    }

    return local;
  }

  // Criar local
  async store(createLocalDTO: CreateLocalDTO): Promise<LocalResponseDTO> {
    const { nome, descricao } = createLocalDTO;

    await this.ensureNameAvailable(nome);

    const local = this.localRepository.create({
      nome,
      descricao: descricao ?? null,
    });

    const savedLocal = await this.localRepository.save(local);

    return this.toResponseDTO(savedLocal);
  }

  // Atualizar local por ID
  async update(
    id: number,
    updateLocalDTO: UpdateLocalDTO,
  ): Promise<LocalResponseDTO> {
    const local = await this.findEntityById(id);

    const { nome, descricao } = updateLocalDTO;

    if (nome !== undefined && nome !== local.nome) {
      await this.ensureNameAvailable(nome, id);
      local.nome = nome;
    }

    if (descricao !== undefined) {
      local.descricao = descricao;
    }

    const updatedLocal = await this.localRepository.save(local);

    return this.toResponseDTO(updatedLocal);
  }

  // Excluir local por ID
  async destroy(id: number): Promise<void> {
    const local = await this.findEntityById(id);

    await this.localRepository.remove(local);
  }

  // Converter entidade para DTO de resposta
  private toResponseDTO(local: Local): LocalResponseDTO {
    return {
      id: local.id,
      nome: local.nome,
      descricao: local.descricao,
      ativo: local.ativo,
      created_at: local.created_at,
      updated_at: local.updated_at,
    };
  }

  // Verificar se o nome já está cadastrado
  private async ensureNameAvailable(
    name: string,
    ignoreId?: number,
  ): Promise<void> {
    const existingLocal = await this.localRepository.findOneBy({
      nome: name,
    });

    if (existingLocal && existingLocal.id !== ignoreId) {
      throw new AppError("Este local já está cadastrado.", 409);
    }
  }
}

export default new LocalService();
