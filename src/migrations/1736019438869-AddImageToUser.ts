import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageToUser1736019438869 implements MigrationInterface {

    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "userImage" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "userImage"
        `);
    }

}
