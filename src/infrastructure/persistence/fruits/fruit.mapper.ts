import { Fruit } from '../../../domain/fruits/entities/fruit.entity';
import { FruitWithRelations } from '../../../domain/fruits/read-models/fruit-with-relations.read-model';
import { FamilyOrmEntity } from '../families/family.orm-entity';
import { TypeFruitOrmEntity } from '../type-fruits/type-fruit.orm-entity';
import { FruitClimateOrmEntity } from './fruit-climate.orm-entity';
import { FruitDepartmentOrmEntity } from './fruit-department.orm-entity';
import { FruitHarvestSeasonOrmEntity } from './fruit-harvest-season.orm-entity';
import { FruitNaturalRegionOrmEntity } from './fruit-natural-region.orm-entity';
import { FruitOrmEntity } from './fruit.orm-entity';

/**
 * Input for mapping a fruit ORM entity plus its bridge rows to a read model.
 */
export interface FruitWithRelationsMapperInput {
    orm: FruitOrmEntity;
    climates: FruitClimateOrmEntity[];
    departments: FruitDepartmentOrmEntity[];
    naturalRegions: FruitNaturalRegionOrmEntity[];
    harvestSeasons: FruitHarvestSeasonOrmEntity[];
}

/**
 * Mapper for the Fruit entity.
 */
export class FruitMapper {
    /**
     * Map an ORM entity to the pure domain entity.
     */
    static toDomain(orm: FruitOrmEntity): Fruit {
        return new Fruit(
            orm.id,
            orm.commonName,
            orm.scientificName,
            orm.description ?? null,
            orm.familyId ?? orm.family?.id,
            orm.typeFruitId ?? orm.typeFruit?.id,
            orm.createdAt,
            orm.updatedAt,
        );
    }
    /**
     * Map a domain entity to an ORM entity ready to persist.
     */
    static toPersistence(domain: Fruit): FruitOrmEntity {
        const orm = new FruitOrmEntity();
        if (domain.id > 0) {
            orm.id = domain.id;
        }
        orm.commonName = domain.commonName;
        orm.scientificName = domain.scientificName;
        orm.description = domain.description ?? null;
        orm.family = { id: domain.familyId } as FamilyOrmEntity;
        orm.typeFruit = { id: domain.typeFruitId } as TypeFruitOrmEntity;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
    /**
     * Map an ORM entity (with family, typePlant and typeFruit loaded) plus its bridge rows
     * (with related entities loaded) to the FruitWithRelations read model.
     */
    static toWithRelations(input: FruitWithRelationsMapperInput): FruitWithRelations {
        const { orm, climates, departments, naturalRegions, harvestSeasons } = input;
        return {
            id: orm.id,
            commonName: orm.commonName,
            scientificName: orm.scientificName,
            description: orm.description ?? null,
            family: {
                id: orm.family.id,
                name: orm.family.name,
                typePlant: {
                    id: orm.family.typePlant.id,
                    name: orm.family.typePlant.name,
                },
            },
            typeFruit: {
                id: orm.typeFruit.id,
                name: orm.typeFruit.name,
            },
            climates: climates.map((row) => ({ id: row.climate.id, name: row.climate.name })),
            departments: departments.map((row) => ({ id: row.department.id, name: row.department.name })),
            naturalRegions: naturalRegions.map((row) => ({ id: row.naturalRegion.id, name: row.naturalRegion.name })),
            harvestSeasons: harvestSeasons.map((row) => ({
                id: row.harvestSeason.id,
                startMonth: row.harvestSeason.startMonth,
                endMonth: row.harvestSeason.endMonth,
            })),
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        };
    }
}
