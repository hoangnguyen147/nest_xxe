import { MigrationInterface, QueryRunner } from 'typeorm';

export class v61659807761914 implements MigrationInterface {
  name = 'v61659807761914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
    await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`post_id\``);
    await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`share_id\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`school\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`student_id\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`student_id\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`school\``);
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD \`share_id\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD \`post_id\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`phone\` varchar(255) NULL`,
    );
  }
}
