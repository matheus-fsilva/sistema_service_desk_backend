import { z } from "zod";

export default function normalizedString() {
  return z.string().trim().min(1, "Este campo não pode ficar vazio.");
}
