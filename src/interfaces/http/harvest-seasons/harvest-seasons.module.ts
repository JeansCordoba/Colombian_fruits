import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateHarvestSeasonUseCase } from '../../../application/harvest-seasons/use-cases/create-harvest-season/create-harvest-season.use-case';
import { DeleteHarvestSeasonUseCase } from '../../../application/harvest-seasons/use-cases/delete-harvest-season/delete-harvest-season.use-case';
import { GetHarvestSeasonByIdUseCase } from '../../../application/harvest-seasons/use-cases/get-harvest-season-by-id/get-harvest-season-by-id.use-case';
import { ListHarvestSeasonsUseCase } from '../../../application/harvest-seasons/use-cases/list-harvest-seasons/list-harvest-seasons.use-case';
import { UpdateHarvestSeasonUseCase } from '../../../application/harvest-seasons/use-cases/update-harvest-season/update-harvest-season.use-case';
import { HARVEST_SEASON_REPOSITORY } from '../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { HarvestSeasonOrmEntity } from '../../../infrastructure/persistence/harvest-seasons/harvest-season.orm-entity';
import { HarvestSeasonRepository } from '../../../infrastructure/persistence/harvest-seasons/harvest-season.repository';
import { HarvestSeasonsController } from './harvest-seasons.controller';

@Module({
    imports: [TypeOrmModule.forFeature([HarvestSeasonOrmEntity])],
    controllers: [HarvestSeasonsController],
    providers: [
        CreateHarvestSeasonUseCase,
        GetHarvestSeasonByIdUseCase,
        ListHarvestSeasonsUseCase,
        UpdateHarvestSeasonUseCase,
        DeleteHarvestSeasonUseCase,
        {
            provide: HARVEST_SEASON_REPOSITORY,
            useClass: HarvestSeasonRepository,
        },
    ],
})
export class HarvestSeasonsModule {}
