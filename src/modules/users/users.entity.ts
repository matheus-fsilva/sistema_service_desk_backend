import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  nome!: string;

  @Column({
    type: "varchar",
    length: 150,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    name: "senha_hash",
    type: "varchar",
    length: 255,
    nullable: false,
  })
  senha_hash!: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  tipo!: "Usuario" | "N1" | "N2" | "Admin";

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
