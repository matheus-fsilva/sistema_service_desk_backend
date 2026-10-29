import { z } from "zod";
import normalizedString from "../../../utils/validators/normalizedString";

export const updateLocalSchema = z
  .object({
    nome: normalizedString()
      .max(100, "O nome deve possuir no máximo 100 caracteres.")
      .optional(),

    descricao: z
      .string()
      .trim()
      .max(255, "A descrição deve possuir no máximo 255 caracteres.")
      .nullable()
      .optional(),
  })
  .refine((data) => data.nome !== undefined || data.descricao !== undefined, {
    message: "Informe ao menos um campo para atualizar.",
  });

export type UpdateLocalDTO = z.infer<typeof updateLocalSchema>;
