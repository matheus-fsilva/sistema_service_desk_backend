import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import Ticket from "../tickets/ticket.entity";
import User from "../users/users.entity";

@Entity({ name: "ticket_comment" })
export default class TicketComment {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relacionamento com chamado

  @ManyToOne(() => Ticket, (chamado) => chamado.comentarios, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id_chamado" })
  chamado!: Ticket;

  // Relacionamento com usuário

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "id_usuario" })
  usuario!: User;

  // Conteúdo do comentário

  @Column({
    type: "text",
    nullable: false,
  })
  comentario!: string;

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
    nullable: false,
  })
  created_at!: Date;
}
