import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "locals" })
export default class Local {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 100,
    unique: true,
    nullable: false,
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
