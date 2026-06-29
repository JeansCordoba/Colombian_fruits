import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedMeta, normalizePagination } from '../../../shared/pagination/normalize-pagination';
import { PaginatedResult } from '../../../shared/types/paginated-result';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { ListTypeFruitsQuery } from './list-type-fruits.query';

@Injectable()
export class ListTypeFruitsUseCase {
    constructor(
        @Inject(TYPE_FRUIT_REPOSITORY)
        private readonly typeFruitRepository: TypeFruitRepositoryPort,
    ) {}

    async execute(query: ListTypeFruitsQuery): Promise<PaginatedResult<TypeFruit>> {
        const { page, limit } = normalizePagination(query.page, query.limit);
        const [data, total] = await Promise.all([
            this.typeFruitRepository.findPaginated(page, limit),
            this.typeFruitRepository.count(),
        ]);
        return {
            data,
            meta: buildPaginatedMeta(total, page, limit),
        };
    }
}
