import type {
  TicketTipo,
  TicketStatus,
  TicketPrioridade,
  TicketNivel,
} from "../../tickets/ticket.entity";

export interface TicketResponseDTO {
  id: number;

  id_solicitante: number;
  id_local: number | null;
  id_equipamento: number | null;
  id_tecnico_atribuido: number | null;
  id_tecnico_resolucao: number | null;

  titulo: string;
  descricao: string;
  tipo: TicketTipo;
  status: TicketStatus;
  prioridade: TicketPrioridade;
  nivel_atendimento: TicketNivel;

  data_abertura: Date;
  data_fechamento: Date | null;

  created_at: Date;
  updated_at: Date;
}
