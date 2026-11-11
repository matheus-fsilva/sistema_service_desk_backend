import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEquipment1794426477830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE equipment (
                id INT NOT NULL AUTO_INCREMENT,
                id_local INT NOT NULL,
                nome VARCHAR(100) NOT NULL,
                descricao VARCHAR(255) NULL,
                ativo TINYINT NOT NULL DEFAULT 1,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX UQ_equipment_nome (nome),
                PRIMARY KEY (id),
                CONSTRAINT FK_equipment_local
                    FOREIGN KEY (id_local)
                    REFERENCES locals(id)
                    ON DELETE RESTRICT
                    ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE equipment
        `);
  }
}
