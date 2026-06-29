import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateClimateUseCase } from '../../../application/climates/use-cases/create-climate/create-climate.use-case';
import { DeleteClimateUseCase } from '../../../application/climates/use-cases/delete-climate/delete-climate.use-case';
import { GetClimateByIdUseCase } from '../../../application/climates/use-cases/get-climate-by-id/get-climate-by-id.use-case';
import { ListClimatesUseCase } from '../../../application/climates/use-cases/list-climates/list-climates.use-case';
import { UpdateClimateUseCase } from '../../../application/climates/use-cases/update-climate/update-climate.use-case';
import { CLIMATE_REPOSITORY } from '../../../domain/climates/repositories/climate.repository.token';
import { ClimateOrmEntity } from '../../../infrastructure/persistence/climates/climate.orm-entity';
import { ClimateRepository } from '../../../infrastructure/persistence/climates/climate.repository';
import { ClimatesController } from './climates.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ClimateOrmEntity])],
    controllers: [ClimatesController],
    providers: [
        CreateClimateUseCase,
        GetClimateByIdUseCase,
        ListClimatesUseCase,
        UpdateClimateUseCase,
        DeleteClimateUseCase,
        {
            provide: CLIMATE_REPOSITORY,
            useClass: ClimateRepository,
        },
    ],
})
export class ClimatesModule {}
