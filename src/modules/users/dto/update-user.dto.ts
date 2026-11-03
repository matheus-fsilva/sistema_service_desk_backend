import { z } from "zod";
import normalizedString from "../../../utils/validators/normalizedString";

export const updateUserSchema = z
  .object({
    nome: normalizedString()
      .max(100, "O nome deve possuir no máximo 100 caracteres.")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Informe um e-mail válido.")
      .max(150, "O e-mail deve possuir no máximo 150 caracteres.")
      .transform((value) => value.toLowerCase())
      .optional(),

    senha: z
      .string()
      .min(8, "A senha deve possuir no mínimo 8 caracteres.")
      .max(72, "A senha deve possuir no máximo 72 caracteres.")
      .optional(),

    tipo: z
      .enum(["Usuario", "N1", "N2", "Admin"], {
        message: "Informe um tipo de usuário válido.",
      })
      .optional(),

    ativo: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.nome !== undefined ||
      data.email !== undefined ||
      data.senha !== undefined ||
      data.tipo !== undefined ||
      data.ativo !== undefined,
    {
      message: "Informe ao menos um campo para atualizar.",
    },
  );

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
