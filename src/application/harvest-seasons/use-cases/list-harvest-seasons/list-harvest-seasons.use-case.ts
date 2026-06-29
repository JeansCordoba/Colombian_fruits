import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedMeta, normalizePagination } from '../../../shared/pagination/normalize-pagination';
import { PaginatedResult } from '../../../shared/types/paginated-result';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { ListHarvestSeasonsQuery } from './list-harvest-seasons.query';

@Injectable()
export class ListHarvestSeasonsUseCase {
    constructor(
        @Inject(HARVEST_SEASON_REPOSITORY)
        private readonly harvestSeasonRepository: HarvestSeasonRepositoryPort,
    ) {}

    async execute(query: ListHarvestSeasonsQuery): Promise<PaginatedResult<HarvestSeason>> {
        const { page, limit } = normalizePagination(query.page, query.limit);
        const [data, total] = await Promise.all([
            this.harvestSeasonRepository.findPaginated(page, limit),
            this.harvestSeasonRepository.count(),
        ]);
        return {
            data,
            meta: buildPaginatedMeta(total, page, limit),
        };
    }
}
