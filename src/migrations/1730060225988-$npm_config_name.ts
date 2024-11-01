import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1730060225988 implements MigrationInterface {
    name = ' $npmConfigName1730060225988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "checklist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "travel_id" uuid, CONSTRAINT "REL_9d95cf837d605fa05b884b6fa8" UNIQUE ("travel_id"), CONSTRAINT "PK_e4b437f5107f2a9d5b744d4eb4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "is_endable" boolean NOT NULL DEFAULT true, "checklist_id" uuid, "user_id" uuid, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "birth_date" TIMESTAMP NOT NULL, "description" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stars" character varying NOT NULL, "content" character varying NOT NULL, "create_user_id" uuid, "received_user_id" uuid, "travel_id" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "state" character varying NOT NULL, "address" character varying NOT NULL, "long_lat_point" character varying NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "travel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "travel_description" character varying, "start_date" TIMESTAMP NOT NULL, "finish_date" TIMESTAMP NOT NULL, "max_cap" integer, "is_endable" boolean NOT NULL DEFAULT true, "creator_user_id" uuid, "location_id" uuid, CONSTRAINT "PK_657b63ec7adcf2ecf757a490a67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityName" character varying NOT NULL, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_user_activities_activity" ("usersId" uuid NOT NULL, "activityId" uuid NOT NULL, CONSTRAINT "PK_8a5db26e7c0d973678ee76b9a77" PRIMARY KEY ("usersId", "activityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1c5790d904f7fe29d31c2b2cd2" ON "users_user_activities_activity" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c3e61b93d294ce363395a19175" ON "users_user_activities_activity" ("activityId") `);
        await queryRunner.query(`CREATE TABLE "users_joins_travels_travel" ("usersId" uuid NOT NULL, "travelId" uuid NOT NULL, CONSTRAINT "PK_05ae89783f0e01445570b0cf01b" PRIMARY KEY ("usersId", "travelId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad376a856fc93c24603e464375" ON "users_joins_travels_travel" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f84ecb8a66d483576f6feebf3e" ON "users_joins_travels_travel" ("travelId") `);
        await queryRunner.query(`CREATE TABLE "travel_travel_activities_activity" ("travelId" uuid NOT NULL, "activityId" uuid NOT NULL, CONSTRAINT "PK_77aeff68a9e434c7ae3a8b2ff87" PRIMARY KEY ("travelId", "activityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_60c9ee0c1136071f842a62edbb" ON "travel_travel_activities_activity" ("travelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb99c4358225ebd612e4faad08" ON "travel_travel_activities_activity" ("activityId") `);
        await queryRunner.query(`ALTER TABLE "checklist" ADD CONSTRAINT "FK_9d95cf837d605fa05b884b6fa87" FOREIGN KEY ("travel_id") REFERENCES "travel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_b5a39d884f278b083075abfa6b2" FOREIGN KEY ("checklist_id") REFERENCES "checklist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_2f3f2831c9b37214309d23b07fd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_83cc71cad059d2eb47a8ceb1c11" FOREIGN KEY ("create_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_d3cf41ba25a29a7dbe099c0fe78" FOREIGN KEY ("received_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_62ec2606b70bfef8351915bd8f6" FOREIGN KEY ("travel_id") REFERENCES "travel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "travel" ADD CONSTRAINT "FK_a19d669c09fa4f5fb737182326d" FOREIGN KEY ("creator_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "travel" ADD CONSTRAINT "FK_fb2b4a20f4cd88cbffc25eb5c71" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_user_activities_activity" ADD CONSTRAINT "FK_1c5790d904f7fe29d31c2b2cd24" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_user_activities_activity" ADD CONSTRAINT "FK_c3e61b93d294ce363395a191752" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_joins_travels_travel" ADD CONSTRAINT "FK_ad376a856fc93c24603e4643759" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_joins_travels_travel" ADD CONSTRAINT "FK_f84ecb8a66d483576f6feebf3e7" FOREIGN KEY ("travelId") REFERENCES "travel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "travel_travel_activities_activity" ADD CONSTRAINT "FK_60c9ee0c1136071f842a62edbb7" FOREIGN KEY ("travelId") REFERENCES "travel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "travel_travel_activities_activity" ADD CONSTRAINT "FK_bb99c4358225ebd612e4faad08d" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "travel_travel_activities_activity" DROP CONSTRAINT "FK_bb99c4358225ebd612e4faad08d"`);
        await queryRunner.query(`ALTER TABLE "travel_travel_activities_activity" DROP CONSTRAINT "FK_60c9ee0c1136071f842a62edbb7"`);
        await queryRunner.query(`ALTER TABLE "users_joins_travels_travel" DROP CONSTRAINT "FK_f84ecb8a66d483576f6feebf3e7"`);
        await queryRunner.query(`ALTER TABLE "users_joins_travels_travel" DROP CONSTRAINT "FK_ad376a856fc93c24603e4643759"`);
        await queryRunner.query(`ALTER TABLE "users_user_activities_activity" DROP CONSTRAINT "FK_c3e61b93d294ce363395a191752"`);
        await queryRunner.query(`ALTER TABLE "users_user_activities_activity" DROP CONSTRAINT "FK_1c5790d904f7fe29d31c2b2cd24"`);
        await queryRunner.query(`ALTER TABLE "travel" DROP CONSTRAINT "FK_fb2b4a20f4cd88cbffc25eb5c71"`);
        await queryRunner.query(`ALTER TABLE "travel" DROP CONSTRAINT "FK_a19d669c09fa4f5fb737182326d"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_62ec2606b70bfef8351915bd8f6"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_d3cf41ba25a29a7dbe099c0fe78"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_83cc71cad059d2eb47a8ceb1c11"`);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_2f3f2831c9b37214309d23b07fd"`);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_b5a39d884f278b083075abfa6b2"`);
        await queryRunner.query(`ALTER TABLE "checklist" DROP CONSTRAINT "FK_9d95cf837d605fa05b884b6fa87"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb99c4358225ebd612e4faad08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_60c9ee0c1136071f842a62edbb"`);
        await queryRunner.query(`DROP TABLE "travel_travel_activities_activity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f84ecb8a66d483576f6feebf3e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad376a856fc93c24603e464375"`);
        await queryRunner.query(`DROP TABLE "users_joins_travels_travel"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c3e61b93d294ce363395a19175"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c5790d904f7fe29d31c2b2cd2"`);
        await queryRunner.query(`DROP TABLE "users_user_activities_activity"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "travel"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "checklist"`);
    }

}
