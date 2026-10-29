export interface EquipmentResponseDTO {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  id_local: number;
  created_at: Date;
  updated_at: Date;
}
