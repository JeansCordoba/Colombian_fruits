import { ClimateOrmEntity } from './climates/climate.orm-entity';
import { DepartmentOrmEntity } from './departments/department.orm-entity';
import { FamilyOrmEntity } from './families/family.orm-entity';
import { FruitClimateOrmEntity } from './fruits/fruit-climate.orm-entity';
import { FruitDepartmentOrmEntity } from './fruits/fruit-department.orm-entity';
import { FruitHarvestSeasonOrmEntity } from './fruits/fruit-harvest-season.orm-entity';
import { FruitNaturalRegionOrmEntity } from './fruits/fruit-natural-region.orm-entity';
import { FruitOrmEntity } from './fruits/fruit.orm-entity';
import { HarvestSeasonOrmEntity } from './harvest-seasons/harvest-season.orm-entity';
import { NaturalRegionOrmEntity } from './natural-regions/natural-region.orm-entity';
import { TypeFruitOrmEntity } from './type-fruits/type-fruit.orm-entity';
import { TypePlantOrmEntity } from './type-plants/type-plant.orm-entity';

/**
 * Barrel export of all TypeORM entities used by the application and migrations CLI.
 */
export const ORM_ENTITIES = [
    TypePlantOrmEntity,
    TypeFruitOrmEntity,
    ClimateOrmEntity,
    DepartmentOrmEntity,
    NaturalRegionOrmEntity,
    HarvestSeasonOrmEntity,
    FamilyOrmEntity,
    FruitOrmEntity,
    FruitClimateOrmEntity,
    FruitDepartmentOrmEntity,
    FruitNaturalRegionOrmEntity,
    FruitHarvestSeasonOrmEntity,
] as const;
