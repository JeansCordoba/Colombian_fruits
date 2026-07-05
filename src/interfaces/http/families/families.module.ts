import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateFamilyUseCase } from '../../../application/families/use-cases/create-family/create-family.use-case';
import { DeleteFamilyUseCase } from '../../../application/families/use-cases/delete-family/delete-family.use-case';
import { GetFamilyByIdUseCase } from '../../../application/families/use-cases/get-family-by-id/get-family-by-id.use-case';
import { ListFamiliesUseCase } from '../../../application/families/use-cases/list-families/list-families.use-case';
import { UpdateFamilyUseCase } from '../../../application/families/use-cases/update-family/update-family.use-case';
import { FAMILY_REPOSITORY } from '../../../domain/families/repositories/family.repository.token';
import { TYPE_PLANT_REPOSITORY } from '../../../domain/type-plants/repositories/type-plant.repository.token';
import { FamilyOrmEntity } from '../../../infrastructure/persistence/families/family.orm-entity';
import { FamilyRepository } from '../../../infrastructure/persistence/families/family.repository';
import { TypePlantOrmEntity } from '../../../infrastructure/persistence/type-plants/type-plant.orm-entity';
import { TypePlantRepository } from '../../../infrastructure/persistence/type-plants/type-plant.repository';
import { FamiliesController } from './families.controller';

@Module({
    imports: [TypeOrmModule.forFeature([FamilyOrmEntity, TypePlantOrmEntity])],
    controllers: [FamiliesController],
    providers: [
        CreateFamilyUseCase,
        GetFamilyByIdUseCase,
        ListFamiliesUseCase,
        UpdateFamilyUseCase,
        DeleteFamilyUseCase,
        {
            provide: FAMILY_REPOSITORY,
            useClass: FamilyRepository,
        },
        {
            provide: TYPE_PLANT_REPOSITORY,
            useClass: TypePlantRepository,
        },
    ],
})
export class FamiliesModule {}
