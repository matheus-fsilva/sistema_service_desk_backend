export interface LocalResponseDTO {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
}
