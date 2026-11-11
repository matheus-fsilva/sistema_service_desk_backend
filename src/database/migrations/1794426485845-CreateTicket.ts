import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTicket1794426485845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE ticket (
                id INT NOT NULL AUTO_INCREMENT,
                titulo VARCHAR(150) NOT NULL,
                descricao TEXT NOT NULL,
                tipo VARCHAR(20) NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'Aberto',
                prioridade VARCHAR(20) NOT NULL,
                nivel_atendimento VARCHAR(10) NOT NULL DEFAULT 'N1',
                data_abertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                data_fechamento DATETIME NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                id_solicitante INT NOT NULL,
                id_local INT NULL,
                id_equipamento INT NULL,
                id_tecnico_atribuido INT NULL,
                id_tecnico_resolucao INT NULL,
                PRIMARY KEY (id),

                CONSTRAINT FK_ticket_solicitante
                    FOREIGN KEY (id_solicitante)
                    REFERENCES users(id)
                    ON DELETE RESTRICT
                    ON UPDATE NO ACTION,

                CONSTRAINT FK_ticket_local
                    FOREIGN KEY (id_local)
                    REFERENCES locals(id)
                    ON DELETE RESTRICT
                    ON UPDATE NO ACTION,

                CONSTRAINT FK_ticket_equipment
                    FOREIGN KEY (id_equipamento)
                    REFERENCES equipment(id)
                    ON DELETE RESTRICT
                    ON UPDATE NO ACTION,

                CONSTRAINT FK_ticket_tecnico_atribuido
                    FOREIGN KEY (id_tecnico_atribuido)
                    REFERENCES users(id)
                    ON DELETE RESTRICT
                    ON UPDATE NO ACTION,

                CONSTRAINT FK_ticket_tecnico_resolucao
                    FOREIGN KEY (id_tecnico_resolucao)
                    REFERENCES users(id)
                    ON DELETE RESTRICT
                    ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE ticket
        `);
  }
}
