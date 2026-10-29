import { z } from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce
    .number()
    .int("A página deve ser um número inteiro.")
    .min(1, "A página mínima é 1.")
    .default(1),

  limit: z.coerce
    .number()
    .int("O limite deve ser um número inteiro.")
    .min(1, "O limite mínimo é 1.")
    .max(100, "O limite máximo é 100.")
    .default(10),

  order: z.preprocess(
    (value) => (typeof value === "string" ? value.toUpperCase() : value),
    z.enum(["ASC", "DESC"]).default("ASC"),
  ),
});

export type SearchParamsDTO = z.infer<typeof searchParamsSchema>;
