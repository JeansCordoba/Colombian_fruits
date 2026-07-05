import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedMeta, normalizePagination } from '../../../shared/pagination/normalize-pagination';
import { PaginatedResult } from '../../../shared/types/paginated-result';
import { FamilyWithTypePlant } from '../../../../domain/families/entities/family-with-type-plant';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { ListFamiliesQuery } from './list-families.query';

@Injectable()
export class ListFamiliesUseCase {
    constructor(
        @Inject(FAMILY_REPOSITORY)
        private readonly familyRepository: FamilyRepositoryPort,
    ) {}

    async execute(query: ListFamiliesQuery): Promise<PaginatedResult<FamilyWithTypePlant>> {
        const { page, limit } = normalizePagination(query.page, query.limit);
        const [data, total] = await Promise.all([
            this.familyRepository.findPaginated(page, limit),
            this.familyRepository.count(),
        ]);
        return {
            data,
            meta: buildPaginatedMeta(total, page, limit),
        };
    }
}
