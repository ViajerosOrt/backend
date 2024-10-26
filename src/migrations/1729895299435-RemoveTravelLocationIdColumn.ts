import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTravelLocationIdColumn1729895299435 implements MigrationInterface {
    name = 'RemoveTravelLocationIdColumn1729895299435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "state" character varying NOT NULL, "address" character varying NOT NULL, "longLatPoint" character varying NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "birthDate" date NOT NULL, "description" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityName" character varying NOT NULL, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "travel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "travelTitle" character varying NOT NULL, "travelDescription" character varying, "startDate" date NOT NULL, "finishDate" date NOT NULL, "maxCap" integer, "isEndable" boolean NOT NULL DEFAULT true, "creatorUserId" uuid NOT NULL, "locationId" uuid, CONSTRAINT "PK_657b63ec7adcf2ecf757a490a67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_user_activities_activity" ("userId" uuid NOT NULL, "activityId" uuid NOT NULL, CONSTRAINT "PK_ef81f0d9dc1ac19571e67e6681c" PRIMARY KEY ("userId", "activityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ac5190618f2b90387661174a99" ON "user_user_activities_activity" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_290a089ad46609c785df433409" ON "user_user_activities_activity" ("activityId") `);
        await queryRunner.query(`CREATE TABLE "user_joins_travels_travel" ("userId" uuid NOT NULL, "travelId" uuid NOT NULL, CONSTRAINT "PK_607d74d91f91b6d55764738950c" PRIMARY KEY ("userId", "travelId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a2a89c0f92919eb982066a1d66" ON "user_joins_travels_travel" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0ba18dcbbdca54dc76f751c440" ON "user_joins_travels_travel" ("travelId") `);
        await queryRunner.query(`CREATE TABLE "travel_travel_activities_activity" ("travelId" uuid NOT NULL, "activityId" uuid NOT NULL, CONSTRAINT "PK_77aeff68a9e434c7ae3a8b2ff87" PRIMARY KEY ("travelId", "activityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_60c9ee0c1136071f842a62edbb" ON "travel_travel_activities_activity" ("travelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb99c4358225ebd612e4faad08" ON "travel_travel_activities_activity" ("activityId") `);
        await queryRunner.query(`ALTER TABLE "travel" ADD CONSTRAINT "FK_7d496829412993c3e69481770f9" FOREIGN KEY ("creatorUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "travel" ADD CONSTRAINT "FK_5bfe486f28e6c04c176d5ecd082" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_user_activities_activity" ADD CONSTRAINT "FK_ac5190618f2b90387661174a999" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_user_activities_activity" ADD CONSTRAINT "FK_290a089ad46609c785df4334096" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_joins_travels_travel" ADD CONSTRAINT "FK_a2a89c0f92919eb982066a1d668" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_joins_travels_travel" ADD CONSTRAINT "FK_0ba18dcbbdca54dc76f751c440a" FOREIGN KEY ("travelId") REFERENCES "travel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "travel_travel_activities_activity" ADD CONSTRAINT "FK_60c9ee0c1136071f842a62edbb7" FOREIGN KEY ("travelId") REFERENCES "travel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "travel_travel_activities_activity" ADD CONSTRAINT "FK_bb99c4358225ebd612e4faad08d" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "travel_travel_activities_activity" DROP CONSTRAINT "FK_bb99c4358225ebd612e4faad08d"`);
        await queryRunner.query(`ALTER TABLE "travel_travel_activities_activity" DROP CONSTRAINT "FK_60c9ee0c1136071f842a62edbb7"`);
        await queryRunner.query(`ALTER TABLE "user_joins_travels_travel" DROP CONSTRAINT "FK_0ba18dcbbdca54dc76f751c440a"`);
        await queryRunner.query(`ALTER TABLE "user_joins_travels_travel" DROP CONSTRAINT "FK_a2a89c0f92919eb982066a1d668"`);
        await queryRunner.query(`ALTER TABLE "user_user_activities_activity" DROP CONSTRAINT "FK_290a089ad46609c785df4334096"`);
        await queryRunner.query(`ALTER TABLE "user_user_activities_activity" DROP CONSTRAINT "FK_ac5190618f2b90387661174a999"`);
        await queryRunner.query(`ALTER TABLE "travel" DROP CONSTRAINT "FK_5bfe486f28e6c04c176d5ecd082"`);
        await queryRunner.query(`ALTER TABLE "travel" DROP CONSTRAINT "FK_7d496829412993c3e69481770f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb99c4358225ebd612e4faad08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_60c9ee0c1136071f842a62edbb"`);
        await queryRunner.query(`DROP TABLE "travel_travel_activities_activity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ba18dcbbdca54dc76f751c440"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a2a89c0f92919eb982066a1d66"`);
        await queryRunner.query(`DROP TABLE "user_joins_travels_travel"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_290a089ad46609c785df433409"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac5190618f2b90387661174a99"`);
        await queryRunner.query(`DROP TABLE "user_user_activities_activity"`);
        await queryRunner.query(`DROP TABLE "travel"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}
