import { z } from "zod";
import normalizedString from "../../../utils/validators/normalizedString";

export const updateEquipmentSchema = z
  .object({
    nome: normalizedString()
      .max(100, "O nome deve ter no máximo 100 caracteres.")
      .optional(),

    descricao: z
      .string()
      .trim()
      .max(255, "A descrição deve ter no máximo 255 caracteres.")
      .nullable()
      .optional(),

    id_local: z
      .number()
      .int("O ID do local deve ser um número inteiro.")
      .positive("O ID do local deve ser maior que zero.")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

export type UpdateEquipmentDTO = z.infer<typeof updateEquipmentSchema>;
