import { z } from "zod";

export const cancelTicketSchema = z.object({
  justificativa: z
    .string()
    .trim()
    .min(1, "A justificativa não pode ficar vazia."),
});

export type CancelTicketDTO = z.infer<typeof cancelTicketSchema>;
