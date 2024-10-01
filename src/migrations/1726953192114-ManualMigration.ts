import { MigrationInterface, QueryRunner } from "typeorm";

export class ManualMigration1726953192114 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "activity" (
                "id" SERIAL PRIMARY KEY,
                "activityName" VARCHAR NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE TABLE if not exists review (
	            id serial4 NOT NULL,
	            stars varchar NOT NULL,
	            "content" varchar NOT NULL,
	            "createdById" int4 NULL,
	            "receivedById" int4 NULL,
	            "travelId" int4 NULL,
	        CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY (id)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL,
                "password" VARCHAR NOT NULL,
                "birth_date" DATE NOT NULL,
                "description" VARCHAR
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "travel" (
                "id" SERIAL PRIMARY KEY,
                "travelTitle" VARCHAR NOT NULL,
                "travelDescription" VARCHAR,
                "startDate" DATE NOT NULL,
                "finishDate" DATE NOT NULL,
                "maxCap" INTEGER,
                "isEndable" BOOLEAN NOT NULL DEFAULT TRUE,
                "creatorUserId" INTEGER NOT NULL,
                FOREIGN KEY("creatorUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user_user_activities_activity" (
                "userId" INTEGER NOT NULL,
                "activityId" INTEGER NOT NULL,
                PRIMARY KEY("userId", "activityId"),
                FOREIGN KEY("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                FOREIGN KEY("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "travel_travel_activities_activity" (
                "travelId" INTEGER NOT NULL,
                "activityId" INTEGER NOT NULL,
                PRIMARY KEY("travelId", "activityId"),
                FOREIGN KEY("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                FOREIGN KEY("travelId") REFERENCES "travel"("id") ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user_joins_travels_travel" (
                "userId" INTEGER NOT NULL,
                "travelId" INTEGER NOT NULL,
                PRIMARY KEY("userId", "travelId"),
                FOREIGN KEY("travelId") REFERENCES "travel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                FOREIGN KEY("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user_user_activities_activity" (
                "userId" INTEGER NOT NULL,
                "activityId" INTEGER NOT NULL,
                PRIMARY KEY("userId", "activityId"),
                FOREIGN KEY("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                FOREIGN KEY("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_user_joins_travels_travel_travelId" ON "user_joins_travels_travel" ("travelId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_user_user_activities_activity_activityId" ON "user_user_activities_activity" ("activityId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_travel_travel_activities_activity_travelId" ON "travel_travel_activities_activity" ("travelId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_user_joins_travels_travel_userId" ON "user_joins_travels_travel" ("userId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_user_user_activities_activity_userId" ON "user_user_activities_activity" ("userId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_travel_travel_activities_activity_activityId" ON "travel_travel_activities_activity" ("activityId");
        `);

        await queryRunner.query(`
            ALTER TABLE public.review ADD CONSTRAINT "FK_1529396a7d5fc87b7d483bcba8f" FOREIGN KEY ("travelId") REFERENCES public.travel(id);
            ALTER TABLE public.review ADD CONSTRAINT "FK_7f1febb5465b721169034ec247f" FOREIGN KEY ("createdById") REFERENCES public."user"(id);
            ALTER TABLE public.review ADD CONSTRAINT "FK_f38d87ff045fb91629bedd66b9a" FOREIGN KEY ("receivedById") REFERENCES public."user"(id);;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
