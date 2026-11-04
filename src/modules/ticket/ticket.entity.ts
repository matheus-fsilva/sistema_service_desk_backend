import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import User from "../users/users.entity";
import Local from "../locals/local.entity";
import Equipment from "../equipment/equipment.entity";
import TicketComment from "./ticketComment.entity";

export type TicketTipo = "Hardware" | "Software";

export type TicketStatus = "Aberto" | "Em andamento" | "Fechado" | "Cancelado";

export type TicketPrioridade = "Baixa" | "Média" | "Alta" | "Crítica";

export type TicketNivel = "N1" | "N2";

@Entity({ name: "ticket" })
export default class Ticket {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relacionamento com solicitante

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "id_solicitante" })
  solicitante!: User;

  // Relacionamento com local

  @ManyToOne(() => Local, {
    nullable: true,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "id_local" })
  local!: Local | null;

  // Relacionamento com equipamento

  @ManyToOne(() => Equipment, {
    nullable: true,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "id_equipamento" })
  equipamento!: Equipment | null;

  // Relacionamento com técnico atribuído

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "id_tecnico_atribuido" })
  tecnico_atribuido!: User | null;

  // Relacionamento com técnico que resolveu

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "id_tecnico_resolucao" })
  tecnico_resolucao!: User | null;

  // Informações do chamado

  @Column({
    type: "varchar",
    length: 150,
    nullable: false,
  })
  titulo!: string;

  @Column({
    type: "text",
    nullable: false,
  })
  descricao!: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  tipo!: TicketTipo;

  @Column({
    type: "varchar",
    length: 20,
    default: "Aberto",
    nullable: false,
  })
  status!: TicketStatus;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  prioridade!: TicketPrioridade;

  @Column({
    type: "varchar",
    length: 10,
    default: "N1",
    nullable: false,
  })
  nivel_atendimento!: TicketNivel;

  // Datas

  @CreateDateColumn({
    name: "data_abertura",
    type: "datetime",
    nullable: false,
  })
  data_abertura!: Date;

  @Column({
    type: "datetime",
    nullable: true,
  })
  data_fechamento!: Date | null;

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
    nullable: false,
  })
  created_at!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "datetime",
    nullable: false,
  })
  updated_at!: Date;

  // Relacionamento com comentários

  @OneToMany(() => TicketComment, (comentario) => comentario.chamado)
  comentarios!: TicketComment[];
}
