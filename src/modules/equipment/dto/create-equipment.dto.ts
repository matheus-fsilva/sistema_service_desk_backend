import { z } from "zod";
import normalizedString from "../../../utils/validators/normalizedString";

export const createEquipmentSchema = z.object({
  nome: normalizedString().max(
    100,
    "O nome deve ter no máximo 100 caracteres.",
  ),

  descricao: z
    .string()
    .trim()
    .max(255, "A descrição deve ter no máximo 255 caracteres.")
    .nullable()
    .optional(),

  id_local: z
    .number()
    .int("O ID do local deve ser um número inteiro.")
    .positive("O ID do local deve ser maior que zero."),
});

export type CreateEquipmentDTO = z.infer<typeof createEquipmentSchema>;
