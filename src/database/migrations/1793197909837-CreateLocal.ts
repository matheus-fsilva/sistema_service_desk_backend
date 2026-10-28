import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLocal1793197909837 implements MigrationInterface {
  name = "CreateLocal1793197909837";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`locals\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(100) NOT NULL, \`descricao\` varchar(255) NULL, \`ativo\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_1c752f6ae3992824dcd180d24c\` (\`nome\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_1c752f6ae3992824dcd180d24c\` ON \`locals\``,
    );
    await queryRunner.query(`DROP TABLE \`locals\``);
  }
}
