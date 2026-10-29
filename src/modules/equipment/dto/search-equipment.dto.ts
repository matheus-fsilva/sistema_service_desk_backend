import { z } from "zod";
import { searchParamsSchema } from "../../../common/dto/search-params.dto";

export const searchEquipmentSchema = searchParamsSchema.extend({
  nome: z.string().trim().min(1, "O nome não pode ficar vazio.").optional(),
});

export type SearchEquipmentDTO = z.infer<typeof searchEquipmentSchema>;
