import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import database from "../../config/database.config";
import authConfig from "../../config/auth.config";
import AppError from "../../errors/AppError";

import User from "../users/users.entity";

import type { LoginDTO } from "./dto/login.dto";
import type { AuthResponseDTO } from "./dto/auth-response.dto";
import type { UserResponseDTO } from "../users/dto/user-response.dto";

class AuthService {
  private get userRepository(): Repository<User> {
    return database.getRepository(User);
  }

  async login(loginDTO: LoginDTO): Promise<AuthResponseDTO> {
    const { email, senha } = loginDTO;

    // Buscar usuário pelo e-mail
    const user = await this.userRepository.findOneBy({ email });

    // Verificar se o usuário existe e está ativo
    if (!user || !user.ativo) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    // Comparar senha informada com o hash armazenado
    const passwordMatch = await bcrypt.compare(senha, user.senha_hash);

    if (!passwordMatch) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    // Gerar Access Token
    const accessToken = jwt.sign(
      {
        sub: String(user.id),
      },
      authConfig.jwt.secret,
      {
        expiresIn: authConfig.jwt.expiresIn,
        algorithm: authConfig.jwt.algorithm,
      },
    );

    // Montar resposta pública do usuário
    const userResponse: UserResponseDTO = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      ativo: user.ativo,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return {
      user: userResponse,
      accessToken,
    };
  }
}

export default new AuthService();
