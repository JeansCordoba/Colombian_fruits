import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedMeta, normalizePagination } from '../../../shared/pagination/normalize-pagination';
import { PaginatedResult } from '../../../shared/types/paginated-result';
import { FruitListItem } from '../../../../domain/fruits/read-models/fruit-with-relations.read-model';
import { FruitRepositoryPort } from '../../../../domain/fruits/repositories/fruit.repository.port';
import { FRUIT_REPOSITORY } from '../../../../domain/fruits/repositories/fruit.repository.token';
import { ListFruitsQuery } from './list-fruits.query';

@Injectable()
export class ListFruitsUseCase {
    constructor(
        @Inject(FRUIT_REPOSITORY)
        private readonly fruitRepository: FruitRepositoryPort,
    ) {}

    async execute(query: ListFruitsQuery): Promise<PaginatedResult<FruitListItem>> {
        const { page, limit } = normalizePagination(query.page, query.limit);
        const [data, total] = await Promise.all([
            this.fruitRepository.findPaginated(page, limit, query.search),
            this.fruitRepository.count(query.search),
        ]);
        return {
            data,
            meta: buildPaginatedMeta(total, page, limit),
        };
    }
}
