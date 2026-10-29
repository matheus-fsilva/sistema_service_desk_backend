import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import Local from "../locals/local.entity";

@Entity({ name: "equipamento" })
export default class Equipment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Local, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "id_local" })
  local!: Local;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    unique: true,
  })
  nome!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  descricao!: string | null;

  @Column({
    type: "boolean",
    default: true,
    nullable: false,
  })
  ativo!: boolean;

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
}
