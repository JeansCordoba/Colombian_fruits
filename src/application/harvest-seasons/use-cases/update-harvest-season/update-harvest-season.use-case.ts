import { Inject, Injectable } from '@nestjs/common';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';
import { HarvestSeasonNotFoundException } from '../../../../domain/harvest-seasons/exceptions/harvest-season.exceptions';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { assertValidHarvestSeasonMonths } from '../../validation/assert-valid-harvest-season-months';
import { UpdateHarvestSeasonCommand } from './update-harvest-season.command';

@Injectable()
export class UpdateHarvestSeasonUseCase {
    constructor(
        @Inject(HARVEST_SEASON_REPOSITORY)
        private readonly harvestSeasonRepository: HarvestSeasonRepositoryPort,
    ) {}

    async execute(command: UpdateHarvestSeasonCommand): Promise<HarvestSeason> {
        assertValidHarvestSeasonMonths(command.startMonth, command.endMonth);
        const existingHarvestSeason = await this.harvestSeasonRepository.findById(command.id);
        if (!existingHarvestSeason) {
            throw new HarvestSeasonNotFoundException(command.id);
        }
        const updatedHarvestSeason = new HarvestSeason(
            existingHarvestSeason.id,
            command.startMonth,
            command.endMonth,
            existingHarvestSeason.createdAt,
            new Date(),
        );
        return this.harvestSeasonRepository.update(updatedHarvestSeason);
    }
}
