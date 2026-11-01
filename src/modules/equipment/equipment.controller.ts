import type { Request, Response } from "express";

import parseId from "../../utils/parseId";
import equipmentService from "./equipment.service";

import type { SearchEquipmentDTO } from "./dto/search-equipment.dto";
import type { CreateEquipmentDTO } from "./dto/create-equipment.dto";
import type { UpdateEquipmentDTO } from "./dto/update-equipment.dto";

import sendPaginatedListResponse from "../../common/responses/send-paginated-list-response";

class EquipmentController {
  // Listar equipamentos com busca, paginação e ordenação
  async index(_req: Request, res: Response): Promise<void> {
    const searchParams = res.locals.validatedQuery as SearchEquipmentDTO;

    const result = await equipmentService.index(searchParams);

    sendPaginatedListResponse(
      res,
      result.data,
      result.pagination,
      "Equipamentos listados com sucesso.",
    );
  }

  // Buscar equipamento por ID
  async show(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    const equipment = await equipmentService.show(id);

    res.status(200).json(equipment);
  }

  // Criar equipamento
  async store(req: Request, res: Response): Promise<void> {
    const equipment = await equipmentService.store(
      req.body as CreateEquipmentDTO,
    );

    res.status(201).json(equipment);
  }

  // Atualizar equipamento por ID
  async update(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    const equipment = await equipmentService.update(
      id,
      req.body as UpdateEquipmentDTO,
    );

    res.status(200).json(equipment);
  }

  // Excluir equipamento por ID
  async destroy(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    await equipmentService.destroy(id);

    res.status(204).send();
  }
}

export default new EquipmentController();
