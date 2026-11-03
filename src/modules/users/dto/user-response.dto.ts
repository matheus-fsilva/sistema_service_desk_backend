export interface UserResponseDTO {
  id: number;
  nome: string;
  email: string;
  tipo: "Usuario" | "N1" | "N2" | "Admin";
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
}
