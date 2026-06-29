import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTypePlantUseCase } from '../../../application/type-plants/use-cases/create-type-plant/create-type-plant.use-case';
import { DeleteTypePlantUseCase } from '../../../application/type-plants/use-cases/delete-type-plant/delete-type-plant.use-case';
import { GetTypePlantByIdUseCase } from '../../../application/type-plants/use-cases/get-type-plant-by-id/get-type-plant-by-id.use-case';
import { ListTypePlantsUseCase } from '../../../application/type-plants/use-cases/list-type-plants/list-type-plants.use-case';
import { UpdateTypePlantUseCase } from '../../../application/type-plants/use-cases/update-type-plant/update-type-plant.use-case';
import { TYPE_PLANT_REPOSITORY } from '../../../domain/type-plants/repositories/type-plant.repository.token';
import { TypePlantOrmEntity } from '../../../infrastructure/persistence/type-plants/type-plant.orm-entity';
import { TypePlantRepository } from '../../../infrastructure/persistence/type-plants/type-plant.repository';
import { TypePlantsController } from './type-plants.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TypePlantOrmEntity])],
    controllers: [TypePlantsController],
    providers: [
        CreateTypePlantUseCase,
        GetTypePlantByIdUseCase,
        ListTypePlantsUseCase,
        UpdateTypePlantUseCase,
        DeleteTypePlantUseCase,
        {
            provide: TYPE_PLANT_REPOSITORY,
            useClass: TypePlantRepository,
        },
    ],
})
export class TypePlantsModule {}
