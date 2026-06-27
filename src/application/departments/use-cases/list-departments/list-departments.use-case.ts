import { Inject, Injectable } from '@nestjs/common';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../../constants/pagination.constants';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { ListDepartmentsQuery } from './list-departments.query';
import { ListDepartmentsResult } from './list-departments.result';

@Injectable()
export class ListDepartmentsUseCase {
    constructor(
        @Inject(DEPARTMENT_REPOSITORY)
        private readonly departmentRepository: DepartmentRepositoryPort,
    ) {}

    async execute(query: ListDepartmentsQuery): Promise<ListDepartmentsResult> {
        const page = query.page > 0 ? query.page : DEFAULT_PAGE;
        const limit = query.limit > 0 ? Math.min(query.limit, MAX_LIMIT) : DEFAULT_LIMIT;
        const [data, total] = await Promise.all([
            this.departmentRepository.findPaginated(page, limit),
            this.departmentRepository.count(),
        ]);
        const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
        return {
            data,
            meta: { total, page, limit, totalPages },
        };
    }
}
