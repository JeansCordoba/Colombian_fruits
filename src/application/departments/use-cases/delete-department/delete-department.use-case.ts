import { Inject, Injectable } from '@nestjs/common';
import { DepartmentNotFoundException } from '../../../../domain/departments/exceptions/department.exceptions';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { DeleteDepartmentCommand } from './delete-department.command';

@Injectable()
export class DeleteDepartmentUseCase {
    constructor(
        @Inject(DEPARTMENT_REPOSITORY)
        private readonly departmentRepository: DepartmentRepositoryPort,
    ) {}

    async execute(command: DeleteDepartmentCommand): Promise<void> {
        const existingDepartment = await this.departmentRepository.findById(command.id);
        if (!existingDepartment) {
            throw new DepartmentNotFoundException(command.id);
        }
        await this.departmentRepository.softDelete(command.id);
    }
}
