import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

// Obter variável de ambiente obrigatória
function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`A variável de ambiente ${name} não foi configurada.`);
  }

  return value;
}

// Validar tamanho mínimo da chave secreta
function validateSecret(name: string): string {
  const secret = getRequiredEnv(name);

  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error(`A chave ${name} deve possuir no mínimo 32 bytes.`);
  }

  return secret;
}

const authConfig = {
  jwt: {
    secret: validateSecret("JWT_SECRET"),

    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "15m") as SignOptions["expiresIn"],

    algorithm: "HS256" as const,
  },
};

export default authConfig;
