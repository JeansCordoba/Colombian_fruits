import { Inject, Injectable } from '@nestjs/common';
import { HarvestSeasonNotFoundException } from '../../../../domain/harvest-seasons/exceptions/harvest-season.exceptions';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { DeleteHarvestSeasonCommand } from './delete-harvest-season.command';

@Injectable()
export class DeleteHarvestSeasonUseCase {
    constructor(
        @Inject(HARVEST_SEASON_REPOSITORY)
        private readonly harvestSeasonRepository: HarvestSeasonRepositoryPort,
    ) {}

    async execute(command: DeleteHarvestSeasonCommand): Promise<void> {
        const existingHarvestSeason = await this.harvestSeasonRepository.findById(command.id);
        if (!existingHarvestSeason) {
            throw new HarvestSeasonNotFoundException(command.id);
        }
        await this.harvestSeasonRepository.softDelete(command.id);
    }
}
