import { MigrationInterface, QueryRunner } from 'typeorm';

export class v41651238946552 implements MigrationInterface {
  name = 'v41651238946552';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`shares\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`link\` varchar(255) NOT NULL, \`thumbnail\` varchar(255) NOT NULL, \`is_public\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shares\` ADD CONSTRAINT \`FK_a8aded2f90f448876f7fe63eab4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shares\` DROP FOREIGN KEY \`FK_a8aded2f90f448876f7fe63eab4\``,
    );
    await queryRunner.query(`DROP TABLE \`shares\``);
  }
}
