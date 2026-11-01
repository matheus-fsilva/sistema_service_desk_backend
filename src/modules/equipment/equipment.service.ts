import { Repository, Like } from "typeorm";

import database from "../../config/database.config";
import AppError from "../../errors/AppError";

import type { SearchEquipmentDTO } from "./dto/search-equipment.dto";
import type { CreateEquipmentDTO } from "./dto/create-equipment.dto";
import type { UpdateEquipmentDTO } from "./dto/update-equipment.dto";
import type { EquipmentResponseDTO } from "./dto/equipment-response.dto";

import type { PaginatedResponseDTO } from "../../common/dto/paginated-response.dto";

import Equipment from "./equipment.entity";
import Local from "../locals/local.entity";

class EquipmentService {
  // Dependência dos repositórios
  private get equipmentRepository(): Repository<Equipment> {
    return database.getRepository(Equipment);
  }

  private get localRepository(): Repository<Local> {
    return database.getRepository(Local);
  }

  // Listar equipamentos com busca por nome, paginação e ordenação
  async index(
    searchParams: SearchEquipmentDTO,
  ): Promise<PaginatedResponseDTO<EquipmentResponseDTO>> {
    const { page, limit, order, nome } = searchParams;

    const [equipments, total] = await this.equipmentRepository.findAndCount({
      where: nome ? { nome: Like(`%${nome}%`) } : {},
      relations: {
        local: true,
      },
      order: {
        id: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: equipments.map((equipment) => this.toResponseDTO(equipment)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar equipamento por ID
  async show(id: number): Promise<EquipmentResponseDTO> {
    const equipment = await this.findEntityById(id);

    return this.toResponseDTO(equipment);
  }

  // Buscar equipamento por ID (sem padrão de resposta)
  private async findEntityById(id: number): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
      relations: {
        local: true,
      },
    });

    if (!equipment) {
      throw new AppError("Equipamento não encontrado.", 404);
    }

    return equipment;
  }

  // Criar equipamento
  async store(
    createEquipmentDTO: CreateEquipmentDTO,
  ): Promise<EquipmentResponseDTO> {
    const { nome, descricao, id_local } = createEquipmentDTO;

    await this.ensureNameAvailable(nome);

    const local = await this.findLocalById(id_local);

    const equipment = this.equipmentRepository.create({
      nome,
      descricao: descricao ?? null,
      local,
    });

    const savedEquipment = await this.equipmentRepository.save(equipment);

    return this.toResponseDTO(savedEquipment);
  }

  // Atualizar equipamento por ID
  async update(
    id: number,
    updateEquipmentDTO: UpdateEquipmentDTO,
  ): Promise<EquipmentResponseDTO> {
    const equipment = await this.findEntityById(id);

    const { nome, descricao, id_local } = updateEquipmentDTO;

    if (nome !== undefined && nome !== equipment.nome) {
      await this.ensureNameAvailable(nome, id);
      equipment.nome = nome;
    }

    if (descricao !== undefined) {
      equipment.descricao = descricao ?? null;
    }

    if (id_local !== undefined && id_local !== equipment.local.id) {
      equipment.local = await this.findLocalById(id_local);
    }

    const updatedEquipment = await this.equipmentRepository.save(equipment);

    return this.toResponseDTO(updatedEquipment);
  }

  // Excluir equipamento por ID
  async destroy(id: number): Promise<void> {
    const equipment = await this.findEntityById(id);

    await this.equipmentRepository.remove(equipment);
  }

  // Buscar local por ID
  private async findLocalById(id: number): Promise<Local> {
    const local = await this.localRepository.findOneBy({ id });

    if (!local) {
      throw new AppError("Local não encontrado.", 404);
    }

    return local;
  }

  // Converter entidade para DTO de resposta
  private toResponseDTO(equipment: Equipment): EquipmentResponseDTO {
    return {
      id: equipment.id,
      nome: equipment.nome,
      descricao: equipment.descricao,
      ativo: equipment.ativo,
      id_local: equipment.local.id,
      created_at: equipment.created_at,
      updated_at: equipment.updated_at,
    };
  }

  // Verificar se o nome já está cadastrado
  private async ensureNameAvailable(
    name: string,
    ignoreId?: number,
  ): Promise<void> {
    const existingEquipment = await this.equipmentRepository.findOneBy({
      nome: name,
    });

    if (existingEquipment && existingEquipment.id !== ignoreId) {
      throw new AppError("Este equipamento já está cadastrado.", 409);
    }
  }
}

export default new EquipmentService();
