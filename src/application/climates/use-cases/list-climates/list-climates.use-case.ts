import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedMeta, normalizePagination } from '../../../shared/pagination/normalize-pagination';
import { PaginatedResult } from '../../../shared/types/paginated-result';
import { Climate } from '../../../../domain/climates/entities/climate.entity';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { ListClimatesQuery } from './list-climates.query';

@Injectable()
export class ListClimatesUseCase {
    constructor(
        @Inject(CLIMATE_REPOSITORY)
        private readonly climateRepository: ClimateRepositoryPort,
    ) {}

    async execute(query: ListClimatesQuery): Promise<PaginatedResult<Climate>> {
        const { page, limit } = normalizePagination(query.page, query.limit);
        const [data, total] = await Promise.all([
            this.climateRepository.findPaginated(page, limit),
            this.climateRepository.count(),
        ]);
        return {
            data,
            meta: buildPaginatedMeta(total, page, limit),
        };
    }
}
