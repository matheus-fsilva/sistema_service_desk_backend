import "reflect-metadata";

import { DataSource } from "typeorm";

const requiredEnv = ["DB_HOST", "DB_NAME", "DB_USER"] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente ausente: ${key}`);
  }
}

const database = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME!,

  entities: [__dirname + "/../modules/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],

  synchronize: false,
  logging: false,
});

export default database;
