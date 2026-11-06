import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTicket1793923920151 implements MigrationInterface {
    name = 'CreateTicket1793923920151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`equipment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(100) NOT NULL, \`descricao\` varchar(255) NULL, \`ativo\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id_local\` int NOT NULL, UNIQUE INDEX \`IDX_263cefd424364e13651085235d\` (\`nome\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(100) NOT NULL, \`email\` varchar(150) NOT NULL, \`senha_hash\` varchar(255) NOT NULL, \`tipo\` varchar(20) NOT NULL, \`ativo\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ticket\` (\`id\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(150) NOT NULL, \`descricao\` text NOT NULL, \`tipo\` varchar(20) NOT NULL, \`status\` varchar(20) NOT NULL DEFAULT 'Aberto', \`prioridade\` varchar(20) NOT NULL, \`nivel_atendimento\` varchar(10) NOT NULL DEFAULT 'N1', \`data_abertura\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`data_fechamento\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id_solicitante\` int NOT NULL, \`id_local\` int NULL, \`id_equipamento\` int NULL, \`id_tecnico_atribuido\` int NULL, \`id_tecnico_resolucao\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ticket_comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`comentario\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`id_chamado\` int NOT NULL, \`id_usuario\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD CONSTRAINT \`FK_254bb2dfe95082e6bf1e7d0eacc\` FOREIGN KEY (\`id_local\`) REFERENCES \`locals\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_84e6c7279d9e7551465de9c05b9\` FOREIGN KEY (\`id_solicitante\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_a915bc901ceccaec377c0f858bd\` FOREIGN KEY (\`id_local\`) REFERENCES \`locals\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_100af36998300e55409d9f46a52\` FOREIGN KEY (\`id_equipamento\`) REFERENCES \`equipment\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_ffdc9e9d121ad957ce1fb5bdb19\` FOREIGN KEY (\`id_tecnico_atribuido\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_5489a2dab0028ec107a3e16cc65\` FOREIGN KEY (\`id_tecnico_resolucao\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket_comment\` ADD CONSTRAINT \`FK_ea851aec985347976fda219e37b\` FOREIGN KEY (\`id_chamado\`) REFERENCES \`ticket\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket_comment\` ADD CONSTRAINT \`FK_86c0468da014a9885f3109d44cf\` FOREIGN KEY (\`id_usuario\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket_comment\` DROP FOREIGN KEY \`FK_86c0468da014a9885f3109d44cf\``);
        await queryRunner.query(`ALTER TABLE \`ticket_comment\` DROP FOREIGN KEY \`FK_ea851aec985347976fda219e37b\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_5489a2dab0028ec107a3e16cc65\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_ffdc9e9d121ad957ce1fb5bdb19\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_100af36998300e55409d9f46a52\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_a915bc901ceccaec377c0f858bd\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_84e6c7279d9e7551465de9c05b9\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP FOREIGN KEY \`FK_254bb2dfe95082e6bf1e7d0eacc\``);
        await queryRunner.query(`DROP TABLE \`ticket_comment\``);
        await queryRunner.query(`DROP TABLE \`ticket\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_263cefd424364e13651085235d\` ON \`equipment\``);
        await queryRunner.query(`DROP TABLE \`equipment\``);
    }

}
