import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToTravel1735601719551 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "travel" 
            ADD COLUMN "imageUrl" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "travel" 
            DROP COLUMN "imageUrl"
        `);
    }

}
