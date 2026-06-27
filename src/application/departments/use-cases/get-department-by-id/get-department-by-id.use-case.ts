import { Inject, Injectable } from '@nestjs/common';
import { Department } from '../../../../domain/departments/entities/department.entity';
import { DepartmentNotFoundException } from '../../../../domain/departments/exceptions/department.exceptions';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { GetDepartmentByIdQuery } from './get-department-by-id.query';

@Injectable()
export class GetDepartmentByIdUseCase {
    constructor(
        @Inject(DEPARTMENT_REPOSITORY)
        private readonly departmentRepository: DepartmentRepositoryPort,
    ) {}

    async execute(query: GetDepartmentByIdQuery): Promise<Department> {
        const department = await this.departmentRepository.findById(query.id);
        if (!department) {
            throw new DepartmentNotFoundException(query.id);
        }
        return department;
    }
}
