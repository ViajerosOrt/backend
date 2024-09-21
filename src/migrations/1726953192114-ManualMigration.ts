import { MigrationInterface, QueryRunner } from "typeorm";

export class ManualMigration1726953192114 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "activite" (
                "id" SERIAL PRIMARY KEY,
                "activiteName" VARCHAR NOT NULL
            );
        `);

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
            ALTER TABLE public.review ADD CONSTRAINT "FK_1529396a7d5fc87b7d483bcba8f" FOREIGN KEY ("travelId") REFERENCES public.travel(id);
            ALTER TABLE public.review ADD CONSTRAINT "FK_7f1febb5465b721169034ec247f" FOREIGN KEY ("createdById") REFERENCES public."user"(id);
            ALTER TABLE public.review ADD CONSTRAINT "FK_f38d87ff045fb91629bedd66b9a" FOREIGN KEY ("receivedById") REFERENCES public."user"(id);
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "travel" (
                "id" SERIAL PRIMARY KEY,
                "travelTitle" VARCHAR NOT NULL,
                "travelDescription" VARCHAR,
                "startDate" DATE NOT NULL,
                "finishDate" DATE NOT NULL,
                "max_cap" INTEGER,
                "isEndable" BOOLEAN NOT NULL DEFAULT TRUE,
                "creatorUserId" INTEGER NOT NULL,
                FOREIGN KEY("creatorUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            CREATE TABLE IF NOT EXISTS "travel_travel_activitis_activite" (
                "travelId" INTEGER NOT NULL,
                "activiteId" INTEGER NOT NULL,
                PRIMARY KEY("travelId", "activiteId"),
                FOREIGN KEY("activiteId") REFERENCES "activite"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                FOREIGN KEY("travelId") REFERENCES "travel"("id") ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" SERIAL PRIMARY KEY,
                "userName" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL,
                "password" VARCHAR NOT NULL,
                "birth_date" DATE NOT NULL,
                "userDescription" VARCHAR
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
            CREATE TABLE IF NOT EXISTS "user_user_activites_activite" (
                "userId" INTEGER NOT NULL,
                "activiteId" INTEGER NOT NULL,
                PRIMARY KEY("userId", "activiteId"),
                FOREIGN KEY("activiteId") REFERENCES "activite"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
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
            INSERT INTO "activite" ("id", "activiteName") VALUES
            (1, 'Nadar'),
            (2, 'Saltar'),
            (3, 'Correr'),
            (4, 'Futbol');
        `);

        await queryRunner.query(`
            INSERT INTO "activity" ("id", "activityName") VALUES
            (1, 'Activity1'),
            (2, 'Activity2');
        `);

        await queryRunner.query(`
            INSERT INTO "travel" ("id", "travelTitle", "travelDescription", "startDate", "finishDate", "max_cap", "isEndable", "creatorUserId") VALUES
            (1, 'Viajer largo', 'EL gran viaje', '2024-05-19', '2024-05-20', 2, TRUE, 1);
        `);

        await queryRunner.query(`
            INSERT INTO "travel_travel_activitis_activite" ("travelId", "activiteId") VALUES
            (1, 1),
            (1, 2),
            (1, 3);
        `);

        await queryRunner.query(`
            INSERT INTO "user" ("id", "userName", "email", "password", "birth_date", "userDescription") VALUES
            (1, 'Franco', 'Bruno@gmail.com', '123456789', '2001-05-19', NULL),
            (2, 'Bruno', 'Bruno@gmail.com', '123456789', '2001-05-19', NULL),
            (3, 'Fabricio', 'Fabricio@gmail.com', '123456789', '2001-05-19', NULL),
            (14, 'Pepe', 'pepita@gmail.com', 'a12345678', '2001-01-31', NULL);
        `);

        await queryRunner.query(`
            INSERT INTO "user_joins_travels_travel" ("userId", "travelId") VALUES
            (1, 1),
            (3, 1);
        `);

        await queryRunner.query(`
            INSERT INTO "user_user_activites_activite" ("userId", "activiteId") VALUES
            (3, 2),
            (2, 2),
            (2, 4),
            (1, 1),
            (1, 3);
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_user_joins_travels_travel_travelId" ON "user_joins_travels_travel" ("travelId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_user_user_activities_activity_activityId" ON "user_user_activities_activity" ("activityId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_user_user_activites_activite_userId" ON "user_user_activites_activite" ("userId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_travel_travel_activities_activity_travelId" ON "travel_travel_activities_activity" ("travelId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_user_user_activites_activite_activiteId" ON "user_user_activites_activite" ("activiteId");
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
            CREATE INDEX IF NOT EXISTS "IDX_travel_travel_activitis_activite_travelId" ON "travel_travel_activitis_activite" ("travelId");
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_travel_travel_activitis_activite_activiteId" ON "travel_travel_activitis_activite" ("activiteId");
        `);
    }



    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
