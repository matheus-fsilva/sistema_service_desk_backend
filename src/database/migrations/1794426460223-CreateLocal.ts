import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLocal1794426460223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE locals (
                id INT NOT NULL AUTO_INCREMENT,
                nome VARCHAR(100) NOT NULL,
                descricao VARCHAR(255) NULL,
                ativo TINYINT NOT NULL DEFAULT 1,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX UQ_locals_nome (nome),
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE locals
        `);
  }
}
