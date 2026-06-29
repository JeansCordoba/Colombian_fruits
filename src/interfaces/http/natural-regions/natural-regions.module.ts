import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateNaturalRegionUseCase } from '../../../application/natural-regions/use-cases/create-natural-region/create-natural-region.use-case';
import { DeleteNaturalRegionUseCase } from '../../../application/natural-regions/use-cases/delete-natural-region/delete-natural-region.use-case';
import { GetNaturalRegionByIdUseCase } from '../../../application/natural-regions/use-cases/get-natural-region-by-id/get-natural-region-by-id.use-case';
import { ListNaturalRegionsUseCase } from '../../../application/natural-regions/use-cases/list-natural-regions/list-natural-regions.use-case';
import { UpdateNaturalRegionUseCase } from '../../../application/natural-regions/use-cases/update-natural-region/update-natural-region.use-case';
import { NATURAL_REGION_REPOSITORY } from '../../../domain/natural-regions/repositories/natural-region.repository.token';
import { NaturalRegionOrmEntity } from '../../../infrastructure/persistence/natural-regions/natural-region.orm-entity';
import { NaturalRegionRepository } from '../../../infrastructure/persistence/natural-regions/natural-region.repository';
import { NaturalRegionsController } from './natural-regions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([NaturalRegionOrmEntity])],
    controllers: [NaturalRegionsController],
    providers: [
        CreateNaturalRegionUseCase,
        GetNaturalRegionByIdUseCase,
        ListNaturalRegionsUseCase,
        UpdateNaturalRegionUseCase,
        DeleteNaturalRegionUseCase,
        {
            provide: NATURAL_REGION_REPOSITORY,
            useClass: NaturalRegionRepository,
        },
    ],
})
export class NaturalRegionsModule {}
