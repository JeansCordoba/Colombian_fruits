import { Inject, Injectable } from '@nestjs/common';
import { Department } from '../../../../domain/departments/entities/department.entity';
import { DuplicateDepartmentCodeException } from '../../../../domain/departments/exceptions/department.exceptions';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { CreateDepartmentCommand } from './create-department.command';

@Injectable()
export class CreateDepartmentUseCase {
    constructor(
        @Inject(DEPARTMENT_REPOSITORY)
        private readonly departmentRepository: DepartmentRepositoryPort,
    ) {}

    async execute(command: CreateDepartmentCommand): Promise<Department> {
        const departmentWithSameCode = await this.departmentRepository.findByCode(command.code);
        if (departmentWithSameCode) {
            throw new DuplicateDepartmentCodeException(command.code);
        }
        const department = new Department(
            0,
            command.name,
            command.code,
            new Date(),
            new Date(),
        );
        return this.departmentRepository.save(department);
    }
}
