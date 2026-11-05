import { Repository, Like } from "typeorm";
import bcrypt from "bcrypt";

import database from "../../config/database.config";
import AppError from "../../errors/AppError";

import type { SearchUserDTO } from "./dto/search-user.dto";
import type { CreateUserDTO } from "./dto/create-user.dto";
import type { UpdateUserDTO } from "./dto/update-user.dto";
import type { UserResponseDTO } from "./dto/user-response.dto";

import type { PaginatedResponseDTO } from "../../common/dto/paginated-response.dto";

import User from "./users.entity";

class UserService {
  // Dependência do repositório
  private get userRepository(): Repository<User> {
    return database.getRepository(User);
  }

  // Listar usuários com busca, paginação e ordenação
  async index(
    searchParams: SearchUserDTO,
  ): Promise<PaginatedResponseDTO<UserResponseDTO>> {
    const { page, limit, order, nome, email, tipo, ativo } = searchParams;

    const [users, total] = await this.userRepository.findAndCount({
      where: {
        ...(nome && { nome: Like(`%${nome}%`) }),
        ...(email && { email: Like(`%${email}%`) }),
        ...(tipo && { tipo }),
        ...(ativo !== undefined && { ativo }),
      },
      order: {
        id: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users.map((user) => this.toResponseDTO(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Listar usuários comuns ativos
  async indexRegularUsers(): Promise<UserResponseDTO[]> {
    return this.indexUsersByType("Usuario");
  }

  // Listar usuários N1 ativos
  async indexN1Users(): Promise<UserResponseDTO[]> {
    return this.indexUsersByType("N1");
  }

  // Listar usuários N2 ativos
  async indexN2Users(): Promise<UserResponseDTO[]> {
    return this.indexUsersByType("N2");
  }

  // Listar administradores ativos
  async indexAdminUsers(): Promise<UserResponseDTO[]> {
    return this.indexUsersByType("Admin");
  }

  // Buscar usuários ativos por tipo
  private async indexUsersByType(
    tipo: User["tipo"],
  ): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.find({
      where: {
        tipo,
        ativo: true,
      },
      order: {
        id: "ASC",
      },
    });

    return users.map((user) => this.toResponseDTO(user));
  }

  // Buscar usuário por ID
  async show(id: number): Promise<UserResponseDTO> {
    const user = await this.findEntityById(id);

    return this.toResponseDTO(user);
  }

  // Buscar usuário por ID (sem padrão de resposta)
  private async findEntityById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return user;
  }

  // Criar usuário
  async store(createUserDTO: CreateUserDTO): Promise<UserResponseDTO> {
    const { nome, senha, tipo } = createUserDTO;
    const email = createUserDTO.email.toLowerCase();

    await this.ensureEmailAvailable(email);

    const senha_hash = await bcrypt.hash(senha, 10);

    const user = this.userRepository.create({
      nome,
      email,
      senha_hash,
      tipo,
    });

    const savedUser = await this.userRepository.save(user);

    return this.toResponseDTO(savedUser);
  }

  // Atualizar usuário por ID
  async update(
    id: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UserResponseDTO> {
    const user = await this.findEntityById(id);

    const { nome, senha, tipo, ativo } = updateUserDTO;
    const email = updateUserDTO.email?.toLowerCase();

    if (nome !== undefined) {
      user.nome = nome;
    }

    if (email !== undefined && email !== user.email) {
      await this.ensureEmailAvailable(email, id);
      user.email = email;
    }

    if (senha !== undefined) {
      user.senha_hash = await bcrypt.hash(senha, 10);
    }

    if (tipo !== undefined) {
      user.tipo = tipo;
    }

    if (ativo !== undefined) {
      user.ativo = ativo;
    }

    const updatedUser = await this.userRepository.save(user);

    return this.toResponseDTO(updatedUser);
  }

  // Desativar usuário por ID
  async destroy(id: number): Promise<void> {
    const user = await this.findEntityById(id);

    user.ativo = false;

    await this.userRepository.save(user);
  }

  // Converter entidade para DTO de resposta
  private toResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      ativo: user.ativo,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  // Verificar se o e-mail já está cadastrado
  private async ensureEmailAvailable(
    email: string,
    ignoreId?: number,
  ): Promise<void> {
    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser && existingUser.id !== ignoreId) {
      throw new AppError("Este e-mail já está cadastrado.", 409);
    }
  }
}

export default new UserService();
