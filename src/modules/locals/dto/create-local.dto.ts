import { z } from "zod";
import normalizedString from "../../../utils/validators/normalizedString";

export const createLocalSchema = z.object({
  nome: normalizedString().max(
    100,
    "O nome deve possuir no máximo 100 caracteres.",
  ),

  descricao: z
    .string()
    .trim()
    .max(255, "A descrição deve possuir no máximo 255 caracteres.")
    .nullable()
    .optional(),
});

export type CreateLocalDTO = z.infer<typeof createLocalSchema>;
