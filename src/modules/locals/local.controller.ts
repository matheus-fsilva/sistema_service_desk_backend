import type { Request, Response } from "express";
import parseId from "../../utils/parseId";
import localService from "./local.service";
import type { CreateLocalDTO } from "./dto/create-local.dto";

class LocalController {
  // Criar local
  async store(req: Request, res: Response): Promise<void> {
    const local = await localService.store(req.body as CreateLocalDTO);

    res.status(201).json(local);
  }

  // Excluir local por ID
  async destroy(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    await localService.destroy(id);

    res.status(204).send();
  }

  // Buscar local por ID
  async show(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    const local = await localService.show(id);

    res.status(200).json(local);
  }
}

export default new LocalController();
