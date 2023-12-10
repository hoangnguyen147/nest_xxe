import { MigrationInterface, QueryRunner } from 'typeorm';

export class v21651218028866 implements MigrationInterface {
  name = 'v21651218028866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`files\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`filename\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`upload_by\` varchar(255) NOT NULL, \`post_id\` varchar(255) NOT NULL, \`share_id\` varchar(255) NOT NULL, \`is_avatar\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`files\``);
  }
}
