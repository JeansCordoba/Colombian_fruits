import { Inject, Injectable } from '@nestjs/common';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { assertValidHarvestSeasonMonths } from '../../validation/assert-valid-harvest-season-months';
import { CreateHarvestSeasonCommand } from './create-harvest-season.command';

@Injectable()
export class CreateHarvestSeasonUseCase {
    constructor(
        @Inject(HARVEST_SEASON_REPOSITORY)
        private readonly harvestSeasonRepository: HarvestSeasonRepositoryPort,
    ) {}

    async execute(command: CreateHarvestSeasonCommand): Promise<HarvestSeason> {
        assertValidHarvestSeasonMonths(command.startMonth, command.endMonth);
        const harvestSeason = new HarvestSeason(
            0,
            command.startMonth,
            command.endMonth,
            new Date(),
            new Date(),
        );
        return this.harvestSeasonRepository.save(harvestSeason);
    }
}
