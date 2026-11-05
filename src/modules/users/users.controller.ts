import type { Request, Response } from "express";

import parseId from "../../utils/parseId";
import userService from "./users.service";

import type { SearchUserDTO } from "./dto/search-user.dto";
import type { CreateUserDTO } from "./dto/create-user.dto";
import type { UpdateUserDTO } from "./dto/update-user.dto";

import sendPaginatedListResponse from "../../common/responses/send-paginated-list-response";

class UserController {
  // Listar usuários com busca, paginação e ordenação
  async index(_req: Request, res: Response): Promise<void> {
    const searchParams = res.locals.validatedQuery as SearchUserDTO;

    const result = await userService.index(searchParams);

    sendPaginatedListResponse(
      res,
      result.data,
      result.pagination,
      "Usuários listados com sucesso.",
    );
  }

  // Listar usuários comuns ativos
  async indexRegularUsers(_req: Request, res: Response): Promise<void> {
    const users = await userService.indexRegularUsers();

    res.status(200).json(users);
  }

  // Listar usuários N1 ativos
  async indexN1Users(_req: Request, res: Response): Promise<void> {
    const users = await userService.indexN1Users();

    res.status(200).json(users);
  }

  // Listar usuários N2 ativos
  async indexN2Users(_req: Request, res: Response): Promise<void> {
    const users = await userService.indexN2Users();

    res.status(200).json(users);
  }

  // Listar administradores ativos
  async indexAdminUsers(_req: Request, res: Response): Promise<void> {
    const users = await userService.indexAdminUsers();

    res.status(200).json(users);
  }

  // Buscar usuário por ID
  async show(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    const user = await userService.show(id);

    res.status(200).json(user);
  }

  // Criar usuário
  async store(req: Request, res: Response): Promise<void> {
    const user = await userService.store(req.body as CreateUserDTO);

    res.status(201).json(user);
  }

  // Atualizar usuário por ID
  async update(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    const user = await userService.update(id, req.body as UpdateUserDTO);

    res.status(200).json(user);
  }

  // Excluir usuário por ID
  async destroy(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    await userService.destroy(id);

    res.status(204).send();
  }
}

export default new UserController();
