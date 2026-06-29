import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedMeta, normalizePagination } from '../../../shared/pagination/normalize-pagination';
import { PaginatedResult } from '../../../shared/types/paginated-result';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { ListNaturalRegionsQuery } from './list-natural-regions.query';

@Injectable()
export class ListNaturalRegionsUseCase {
    constructor(
        @Inject(NATURAL_REGION_REPOSITORY)
        private readonly naturalRegionRepository: NaturalRegionRepositoryPort,
    ) {}

    async execute(query: ListNaturalRegionsQuery): Promise<PaginatedResult<NaturalRegion>> {
        const { page, limit } = normalizePagination(query.page, query.limit);
        const [data, total] = await Promise.all([
            this.naturalRegionRepository.findPaginated(page, limit),
            this.naturalRegionRepository.count(),
        ]);
        return {
            data,
            meta: buildPaginatedMeta(total, page, limit),
        };
    }
}
