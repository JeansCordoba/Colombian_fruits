import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FruitRelationsValidator } from '../../../application/fruits/services/fruit-relations.validator';
import { CreateFruitUseCase } from '../../../application/fruits/use-cases/create-fruit/create-fruit.use-case';
import { DeleteFruitUseCase } from '../../../application/fruits/use-cases/delete-fruit/delete-fruit.use-case';
import { GetFruitByIdUseCase } from '../../../application/fruits/use-cases/get-fruit-by-id/get-fruit-by-id.use-case';
import { ListFruitsUseCase } from '../../../application/fruits/use-cases/list-fruits/list-fruits.use-case';
import { UpdateFruitUseCase } from '../../../application/fruits/use-cases/update-fruit/update-fruit.use-case';
import { CLIMATE_REPOSITORY } from '../../../domain/climates/repositories/climate.repository.token';
import { DEPARTMENT_REPOSITORY } from '../../../domain/departments/repositories/department.repository.token';
import { FRUIT_REPOSITORY } from '../../../domain/fruits/repositories/fruit.repository.token';
import { HARVEST_SEASON_REPOSITORY } from '../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { NATURAL_REGION_REPOSITORY } from '../../../domain/natural-regions/repositories/natural-region.repository.token';
import { TYPE_FRUIT_REPOSITORY } from '../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { ClimateOrmEntity } from '../../../infrastructure/persistence/climates/climate.orm-entity';
import { ClimateRepository } from '../../../infrastructure/persistence/climates/climate.repository';
import { DepartmentOrmEntity } from '../../../infrastructure/persistence/departments/department.orm-entity';
import { DepartmentRepository } from '../../../infrastructure/persistence/departments/department.repository';
import { FruitClimateOrmEntity } from '../../../infrastructure/persistence/fruits/fruit-climate.orm-entity';
import { FruitDepartmentOrmEntity } from '../../../infrastructure/persistence/fruits/fruit-department.orm-entity';
import { FruitHarvestSeasonOrmEntity } from '../../../infrastructure/persistence/fruits/fruit-harvest-season.orm-entity';
import { FruitNaturalRegionOrmEntity } from '../../../infrastructure/persistence/fruits/fruit-natural-region.orm-entity';
import { FruitOrmEntity } from '../../../infrastructure/persistence/fruits/fruit.orm-entity';
import { FruitRepository } from '../../../infrastructure/persistence/fruits/fruit.repository';
import { HarvestSeasonOrmEntity } from '../../../infrastructure/persistence/harvest-seasons/harvest-season.orm-entity';
import { HarvestSeasonRepository } from '../../../infrastructure/persistence/harvest-seasons/harvest-season.repository';
import { NaturalRegionOrmEntity } from '../../../infrastructure/persistence/natural-regions/natural-region.orm-entity';
import { NaturalRegionRepository } from '../../../infrastructure/persistence/natural-regions/natural-region.repository';
import { TypeFruitOrmEntity } from '../../../infrastructure/persistence/type-fruits/type-fruit.orm-entity';
import { TypeFruitRepository } from '../../../infrastructure/persistence/type-fruits/type-fruit.repository';
import { FamiliesModule } from '../families/families.module';
import { FruitsController } from './fruits.controller';

@Module({
    imports: [
        FamiliesModule,
        TypeOrmModule.forFeature([
            FruitOrmEntity,
            FruitClimateOrmEntity,
            FruitDepartmentOrmEntity,
            FruitNaturalRegionOrmEntity,
            FruitHarvestSeasonOrmEntity,
            TypeFruitOrmEntity,
            ClimateOrmEntity,
            DepartmentOrmEntity,
            NaturalRegionOrmEntity,
            HarvestSeasonOrmEntity,
        ]),
    ],
    controllers: [FruitsController],
    providers: [
        FruitRelationsValidator,
        CreateFruitUseCase,
        GetFruitByIdUseCase,
        ListFruitsUseCase,
        UpdateFruitUseCase,
        DeleteFruitUseCase,
        {
            provide: FRUIT_REPOSITORY,
            useClass: FruitRepository,
        },
        {
            provide: TYPE_FRUIT_REPOSITORY,
            useClass: TypeFruitRepository,
        },
        {
            provide: CLIMATE_REPOSITORY,
            useClass: ClimateRepository,
        },
        {
            provide: DEPARTMENT_REPOSITORY,
            useClass: DepartmentRepository,
        },
        {
            provide: NATURAL_REGION_REPOSITORY,
            useClass: NaturalRegionRepository,
        },
        {
            provide: HARVEST_SEASON_REPOSITORY,
            useClass: HarvestSeasonRepository,
        },
    ],
})
export class FruitsModule {}
