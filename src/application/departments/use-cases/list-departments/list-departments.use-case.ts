import { Inject, Injectable } from '@nestjs/common';
import { buildPaginatedMeta, normalizePagination } from '../../../shared/pagination/normalize-pagination';
import { PaginatedResult } from '../../../shared/types/paginated-result';
import { Department } from '../../../../domain/departments/entities/department.entity';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { ListDepartmentsQuery } from './list-departments.query';

@Injectable()
export class ListDepartmentsUseCase {
    constructor(
        @Inject(DEPARTMENT_REPOSITORY)
        private readonly departmentRepository: DepartmentRepositoryPort,
    ) {}

    async execute(query: ListDepartmentsQuery): Promise<PaginatedResult<Department>> {
        const { page, limit } = normalizePagination(query.page, query.limit);
        const [data, total] = await Promise.all([
            this.departmentRepository.findPaginated(page, limit),
            this.departmentRepository.count(),
        ]);
        return {
            data,
            meta: buildPaginatedMeta(total, page, limit),
        };
    }
}
