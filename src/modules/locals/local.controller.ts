import type { Request, Response } from "express";
import parseId from "../../utils/parseId";
import localService from "./local.service";
import type { CreateLocalDTO } from "./dto/create-local.dto";
import type { UpdateLocalDTO } from "./dto/update-local.dto";

class LocalController {
  // Buscar local por ID
  async show(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    const local = await localService.show(id);

    res.status(200).json(local);
  }

  // Criar local
  async store(req: Request, res: Response): Promise<void> {
    const local = await localService.store(req.body as CreateLocalDTO);

    res.status(201).json(local);
  }

  // Atualizar local por ID
  async update(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    const local = await localService.update(id, req.body as UpdateLocalDTO);

    res.status(200).json(local);
  }

  // Excluir local por ID
  async destroy(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    await localService.destroy(id);

    res.status(204).send();
  }
}

export default new LocalController();
