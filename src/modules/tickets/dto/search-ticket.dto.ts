import { z } from "zod";
import { searchParamsSchema } from "../../../common/dto/search-params.dto";

export const searchTicketSchema = searchParamsSchema.extend({
  titulo: z
    .string()
    .trim()
    .min(1, "O título da busca não pode ficar vazio.")
    .optional(),

  tipo: z.enum(["Hardware", "Software"]).optional(),

  status: z.enum(["Aberto", "Em andamento", "Fechado", "Cancelado"]).optional(),

  prioridade: z.enum(["Baixa", "Média", "Alta", "Crítica"]).optional(),

  nivel_atendimento: z.enum(["N1", "N2"]).optional(),

  id_solicitante: z.coerce.number().int().positive().optional(),

  id_local: z.coerce.number().int().positive().optional(),

  id_tecnico_atribuido: z.coerce.number().int().positive().optional(),
});

export type SearchTicketDTO = z.infer<typeof searchTicketSchema>;
