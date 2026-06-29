import { Inject, Injectable } from '@nestjs/common';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';
import { HarvestSeasonNotFoundException } from '../../../../domain/harvest-seasons/exceptions/harvest-season.exceptions';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { GetHarvestSeasonByIdQuery } from './get-harvest-season-by-id.query';

@Injectable()
export class GetHarvestSeasonByIdUseCase {
    constructor(
        @Inject(HARVEST_SEASON_REPOSITORY)
        private readonly harvestSeasonRepository: HarvestSeasonRepositoryPort,
    ) {}

    async execute(query: GetHarvestSeasonByIdQuery): Promise<HarvestSeason> {
        const harvestSeason = await this.harvestSeasonRepository.findById(query.id);
        if (!harvestSeason) {
            throw new HarvestSeasonNotFoundException(query.id);
        }
        return harvestSeason;
    }
}
