import { z } from "zod";
import { searchParamsSchema } from "../../../common/dto/search-params.dto";

export const searchLocalSchema = searchParamsSchema.extend({
  nome: z
    .string()
    .trim()
    .min(1, "O nome da busca não pode ficar vazio.")
    .optional(),
});

export type SearchLocalDTO = z.infer<typeof searchLocalSchema>;
