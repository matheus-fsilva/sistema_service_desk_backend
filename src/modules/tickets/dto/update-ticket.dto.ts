import { z } from "zod";
import normalizedString from "../../../utils/validators/normalizedString";

export const updateTicketSchema = z
  .object({
    titulo: normalizedString()
      .max(150, "O título deve possuir no máximo 150 caracteres.")
      .optional(),

    descricao: z
      .string()
      .trim()
      .min(1, "A descrição não pode ficar vazia.")
      .optional(),

    tipo: z
      .enum(["Hardware", "Software"], {
        message: "O tipo deve ser Hardware ou Software.",
      })
      .optional(),

    prioridade: z
      .enum(["Baixa", "Média", "Alta", "Crítica"], {
        message: "Informe uma prioridade válida.",
      })
      .optional(),

    status: z
      .enum(["Aberto", "Em andamento", "Fechado"], {
        message: "Informe um status válido.",
      })
      .optional(),

    nivel_atendimento: z
      .enum(["N1", "N2"], {
        message: "Informe um nível de atendimento válido.",
      })
      .optional(),

    id_local: z.number().int().positive().nullable().optional(),

    id_equipamento: z.number().int().positive().nullable().optional(),

    id_tecnico_atribuido: z.number().int().positive().nullable().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Informe ao menos um campo para atualizar.",
  });

export type UpdateTicketDTO = z.infer<typeof updateTicketSchema>;
