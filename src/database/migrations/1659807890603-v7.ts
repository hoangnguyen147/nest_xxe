import { MigrationInterface, QueryRunner } from 'typeorm';

export class v71659807890603 implements MigrationInterface {
  name = 'v71659807890603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`school\` \`school\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`student_id\` \`student_id\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`student_id\` \`student_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`school\` \`school\` varchar(255) NOT NULL`,
    );
  }
}
