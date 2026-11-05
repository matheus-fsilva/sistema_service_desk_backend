import { z } from "zod";

export const createTicketCommentSchema = z.object({
  comentario: z.string().trim().min(1, "O comentário não pode ficar vazio."),
});

export type CreateTicketCommentDTO = z.infer<typeof createTicketCommentSchema>;
