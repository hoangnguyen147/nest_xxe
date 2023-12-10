import { MigrationInterface, QueryRunner } from 'typeorm';

export class v31651219922434 implements MigrationInterface {
  name = 'v31651219922434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`files\` CHANGE \`post_id\` \`post_id\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` CHANGE \`share_id\` \`share_id\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` CHANGE \`is_avatar\` \`is_avatar\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`files\` CHANGE \`is_avatar\` \`is_avatar\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` CHANGE \`share_id\` \`share_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` CHANGE \`post_id\` \`post_id\` varchar(255) NOT NULL`,
    );
  }
}
