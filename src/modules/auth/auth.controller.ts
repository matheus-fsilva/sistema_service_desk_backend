import { Request, Response } from "express";

import authService from "./auth.service";
import type { LoginDTO } from "./dto/login.dto";

class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    const loginDTO = req.body as LoginDTO;

    const authResponse = await authService.login(loginDTO);

    return res.status(200).json(authResponse);
  }
}

export default new AuthController();
