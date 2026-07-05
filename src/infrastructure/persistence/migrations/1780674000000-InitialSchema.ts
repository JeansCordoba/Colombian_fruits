import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1780674000000 implements MigrationInterface {
    name = 'InitialSchema1780674000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "type_plants" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_type_plants" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "type_fruits" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_type_fruits" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "climates" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_climates" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "department" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "code" character varying(4) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_department" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "natural_regions" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_natural_regions" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "harvest_seasons" (
                "id" SERIAL NOT NULL,
                "start_month" integer NOT NULL,
                "end_month" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_harvest_seasons" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "families" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "type_plant_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_families" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_families_type_plant_id" ON "families" ("type_plant_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "families"
            ADD CONSTRAINT "FK_families_type_plant_id"
            FOREIGN KEY ("type_plant_id") REFERENCES "type_plants"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE TABLE "fruits" (
                "id" SERIAL NOT NULL,
                "common_name" character varying(50) NOT NULL,
                "scientific_name" character varying(100) NOT NULL,
                "description" text,
                "family_id" integer NOT NULL,
                "type_fruit_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_fruits" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_fruits_scientific_name" UNIQUE ("scientific_name")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fruits_family_id" ON "fruits" ("family_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fruits_type_fruit_id" ON "fruits" ("type_fruit_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "fruits"
            ADD CONSTRAINT "FK_fruits_family_id"
            FOREIGN KEY ("family_id") REFERENCES "families"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "fruits"
            ADD CONSTRAINT "FK_fruits_type_fruit_id"
            FOREIGN KEY ("type_fruit_id") REFERENCES "type_fruits"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE TABLE "fruit_climates" (
                "fruit_id" integer NOT NULL,
                "climate_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_fruit_climates" PRIMARY KEY ("fruit_id", "climate_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fruit_climates_climate_id" ON "fruit_climates" ("climate_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "fruit_climates"
            ADD CONSTRAINT "FK_fruit_climates_fruit_id"
            FOREIGN KEY ("fruit_id") REFERENCES "fruits"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "fruit_climates"
            ADD CONSTRAINT "FK_fruit_climates_climate_id"
            FOREIGN KEY ("climate_id") REFERENCES "climates"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE TABLE "fruit_departments" (
                "fruit_id" integer NOT NULL,
                "department_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_fruit_departments" PRIMARY KEY ("fruit_id", "department_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fruit_departments_department_id" ON "fruit_departments" ("department_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "fruit_departments"
            ADD CONSTRAINT "FK_fruit_departments_fruit_id"
            FOREIGN KEY ("fruit_id") REFERENCES "fruits"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "fruit_departments"
            ADD CONSTRAINT "FK_fruit_departments_department_id"
            FOREIGN KEY ("department_id") REFERENCES "department"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE TABLE "fruit_natural_regions" (
                "fruit_id" integer NOT NULL,
                "natural_region_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_fruit_natural_regions" PRIMARY KEY ("fruit_id", "natural_region_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fruit_natural_regions_natural_region_id" ON "fruit_natural_regions" ("natural_region_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "fruit_natural_regions"
            ADD CONSTRAINT "FK_fruit_natural_regions_fruit_id"
            FOREIGN KEY ("fruit_id") REFERENCES "fruits"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "fruit_natural_regions"
            ADD CONSTRAINT "FK_fruit_natural_regions_natural_region_id"
            FOREIGN KEY ("natural_region_id") REFERENCES "natural_regions"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE TABLE "fruit_harvest_seasons" (
                "fruit_id" integer NOT NULL,
                "harvest_season_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_fruit_harvest_seasons" PRIMARY KEY ("fruit_id", "harvest_season_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fruit_harvest_seasons_harvest_season_id" ON "fruit_harvest_seasons" ("harvest_season_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "fruit_harvest_seasons"
            ADD CONSTRAINT "FK_fruit_harvest_seasons_fruit_id"
            FOREIGN KEY ("fruit_id") REFERENCES "fruits"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "fruit_harvest_seasons"
            ADD CONSTRAINT "FK_fruit_harvest_seasons_harvest_season_id"
            FOREIGN KEY ("harvest_season_id") REFERENCES "harvest_seasons"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fruit_harvest_seasons" DROP CONSTRAINT "FK_fruit_harvest_seasons_harvest_season_id"`);
        await queryRunner.query(`ALTER TABLE "fruit_harvest_seasons" DROP CONSTRAINT "FK_fruit_harvest_seasons_fruit_id"`);
        await queryRunner.query(`DROP TABLE "fruit_harvest_seasons"`);
        await queryRunner.query(`ALTER TABLE "fruit_natural_regions" DROP CONSTRAINT "FK_fruit_natural_regions_natural_region_id"`);
        await queryRunner.query(`ALTER TABLE "fruit_natural_regions" DROP CONSTRAINT "FK_fruit_natural_regions_fruit_id"`);
        await queryRunner.query(`DROP TABLE "fruit_natural_regions"`);
        await queryRunner.query(`ALTER TABLE "fruit_departments" DROP CONSTRAINT "FK_fruit_departments_department_id"`);
        await queryRunner.query(`ALTER TABLE "fruit_departments" DROP CONSTRAINT "FK_fruit_departments_fruit_id"`);
        await queryRunner.query(`DROP TABLE "fruit_departments"`);
        await queryRunner.query(`ALTER TABLE "fruit_climates" DROP CONSTRAINT "FK_fruit_climates_climate_id"`);
        await queryRunner.query(`ALTER TABLE "fruit_climates" DROP CONSTRAINT "FK_fruit_climates_fruit_id"`);
        await queryRunner.query(`DROP TABLE "fruit_climates"`);
        await queryRunner.query(`ALTER TABLE "fruits" DROP CONSTRAINT "FK_fruits_type_fruit_id"`);
        await queryRunner.query(`ALTER TABLE "fruits" DROP CONSTRAINT "FK_fruits_family_id"`);
        await queryRunner.query(`DROP TABLE "fruits"`);
        await queryRunner.query(`ALTER TABLE "families" DROP CONSTRAINT "FK_families_type_plant_id"`);
        await queryRunner.query(`DROP TABLE "families"`);
        await queryRunner.query(`DROP TABLE "harvest_seasons"`);
        await queryRunner.query(`DROP TABLE "natural_regions"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "climates"`);
        await queryRunner.query(`DROP TABLE "type_fruits"`);
        await queryRunner.query(`DROP TABLE "type_plants"`);
    }
}
