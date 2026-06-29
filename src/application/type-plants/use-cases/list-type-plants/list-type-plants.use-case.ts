import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedMeta, normalizePagination } from '../../../shared/pagination/normalize-pagination';
import { PaginatedResult } from '../../../shared/types/paginated-result';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { ListTypePlantsQuery } from './list-type-plants.query';

@Injectable()
export class ListTypePlantsUseCase {
    constructor(
        @Inject(TYPE_PLANT_REPOSITORY)
        private readonly typePlantRepository: TypePlantRepositoryPort,
    ) {}

    async execute(query: ListTypePlantsQuery): Promise<PaginatedResult<TypePlant>> {
        const { page, limit } = normalizePagination(query.page, query.limit);
        const [data, total] = await Promise.all([
            this.typePlantRepository.findPaginated(page, limit),
            this.typePlantRepository.count(),
        ]);
        return {
            data,
            meta: buildPaginatedMeta(total, page, limit),
        };
    }
}
