import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEquipment1793290534187 implements MigrationInterface {
    name = 'CreateEquipment1793290534187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`equipamento\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(100) NOT NULL, \`descricao\` varchar(255) NULL, \`ativo\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id_local\` int NOT NULL, UNIQUE INDEX \`IDX_bd880d1d6ccb54865a43a3625b\` (\`nome\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`equipamento\` ADD CONSTRAINT \`FK_502a03b55405e5cb41e305645c0\` FOREIGN KEY (\`id_local\`) REFERENCES \`locals\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`equipamento\` DROP FOREIGN KEY \`FK_502a03b55405e5cb41e305645c0\``);
        await queryRunner.query(`DROP INDEX \`IDX_bd880d1d6ccb54865a43a3625b\` ON \`equipamento\``);
        await queryRunner.query(`DROP TABLE \`equipamento\``);
    }

}
