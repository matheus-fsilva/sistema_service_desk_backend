import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTicketComment1794426491184 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE ticket_comment (
                id INT NOT NULL AUTO_INCREMENT,
                comentario TEXT NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                id_chamado INT NOT NULL,
                id_usuario INT NOT NULL,
                PRIMARY KEY (id),

                CONSTRAINT FK_ticket_comment_ticket
                    FOREIGN KEY (id_chamado)
                    REFERENCES ticket(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,

                CONSTRAINT FK_ticket_comment_user
                    FOREIGN KEY (id_usuario)
                    REFERENCES users(id)
                    ON DELETE RESTRICT
                    ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE ticket_comment
        `);
  }
}
