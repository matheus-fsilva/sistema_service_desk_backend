import { z } from "zod";
import { searchParamsSchema } from "../../../common/dto/search-params.dto";

export const searchUserSchema = searchParamsSchema.extend({
  nome: z
    .string()
    .trim()
    .min(1, "O nome da busca não pode ficar vazio.")
    .optional(),

  email: z
    .string()
    .trim()
    .min(1, "O e-mail da busca não pode ficar vazio.")
    .optional(),

  tipo: z
    .enum(["Usuario", "N1", "N2", "Admin"], {
      message: "Informe um tipo de usuário válido.",
    })
    .optional(),

  ativo: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type SearchUserDTO = z.infer<typeof searchUserSchema>;
