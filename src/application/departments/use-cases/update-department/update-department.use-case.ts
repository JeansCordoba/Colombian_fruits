import { Inject, Injectable } from '@nestjs/common';
import { Department } from '../../../../domain/departments/entities/department.entity';
import {
    DepartmentNotFoundException,
    DuplicateDepartmentCodeException,
} from '../../../../domain/departments/exceptions/department.exceptions';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { UpdateDepartmentCommand } from './update-department.command';

@Injectable()
export class UpdateDepartmentUseCase {
    constructor(
        @Inject(DEPARTMENT_REPOSITORY)
        private readonly departmentRepository: DepartmentRepositoryPort,
    ) {}

    async execute(command: UpdateDepartmentCommand): Promise<Department> {
        const existingDepartment = await this.departmentRepository.findById(command.id);
        if (!existingDepartment) {
            throw new DepartmentNotFoundException(command.id);
        }
        if (command.code !== existingDepartment.code) {
            const departmentWithSameCode = await this.departmentRepository.findByCode(command.code);
            if (departmentWithSameCode) {
                throw new DuplicateDepartmentCodeException(command.code);
            }
        }
        const updatedDepartment = new Department(
            existingDepartment.id,
            command.name,
            command.code,
            existingDepartment.createdAt,
            new Date(),
        );
        return this.departmentRepository.update(updatedDepartment);
    }
}
