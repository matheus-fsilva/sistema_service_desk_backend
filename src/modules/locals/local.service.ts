import { Repository } from "typeorm";
import database from "../../config/database.config";
import AppError from "../../errors/AppError";
import type { CreateLocalDTO } from "./dto/create-local.dto";
import type { LocalResponseDTO } from "./dto/local-response.dto";
import Local from "./local.entity";

class LocalService {
  // Dependência do repositório
  private get localRepository(): Repository<Local> {
    return database.getRepository(Local);
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

  // Buscar local por ID
  async show(id: number): Promise<LocalResponseDTO> {
    const local = await this.findEntityById(id);

    return this.toResponseDTO(local);
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

  // Buscar local por ID (sem padrão de resposta)
  private async findEntityById(id: number): Promise<Local> {
    const local = await this.localRepository.findOneBy({ id });

    if (!local) {
      throw new AppError("Local não encontrado.", 404);
    }

    return local;
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
