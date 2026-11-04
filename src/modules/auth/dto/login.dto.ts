import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .max(150, "O e-mail deve possuir no máximo 150 caracteres.")
    .transform((value) => value.toLowerCase()),

  senha: z
    .string()
    .min(1, "A senha é obrigatória.")
    .max(72, "A senha deve possuir no máximo 72 caracteres."),
});

export type LoginDTO = z.infer<typeof loginSchema>;
