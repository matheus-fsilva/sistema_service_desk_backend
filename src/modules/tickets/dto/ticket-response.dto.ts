import { z } from "zod";
import normalizedString from "../../../utils/validators/normalizedString";

export const createTicketSchema = z.object({
  titulo: normalizedString().max(
    150,
    "O título deve possuir no máximo 150 caracteres.",
  ),

  descricao: z.string().trim().min(1, "A descrição não pode ficar vazia."),

  tipo: z.enum(["Hardware", "Software"], {
    message: "O tipo deve ser Hardware ou Software.",
  }),

  prioridade: z.enum(["Baixa", "Média", "Alta", "Crítica"], {
    message: "Informe uma prioridade válida.",
  }),

  id_local: z.number().int().positive().nullable().optional(),

  id_equipamento: z.number().int().positive().nullable().optional(),

  nivel_atendimento: z.enum(["N1", "N2"]).optional(),
});

export type CreateTicketDTO = z.infer<typeof createTicketSchema>;
