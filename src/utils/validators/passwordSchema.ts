import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "A senha deve possuir no mínimo 8 caracteres.")
  .refine(
    (value) => Buffer.byteLength(value, "utf8") <= 72,
    "A senha deve possuir no máximo 72 bytes.",
  )
  .regex(/[A-Z]/, "A senha deve possuir pelo menos uma letra maiúscula.")
  .regex(/[a-z]/, "A senha deve possuir pelo menos uma letra minúscula.")
  .regex(/[0-9]/, "A senha deve possuir pelo menos um número.")
  .regex(
    /[^A-Za-z0-9]/,
    "A senha deve possuir pelo menos um caractere especial.",
  );

export default passwordSchema;
