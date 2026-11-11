import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1794426469956 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE users (
                id INT NOT NULL AUTO_INCREMENT,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                senha_hash VARCHAR(255) NOT NULL,
                tipo VARCHAR(20) NOT NULL,
                ativo TINYINT NOT NULL DEFAULT 1,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX UQ_users_email (email),
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE users
        `);
  }
}
