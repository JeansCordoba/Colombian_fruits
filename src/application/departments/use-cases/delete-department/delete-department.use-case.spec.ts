import { Test, TestingModule } from '@nestjs/testing';
import { Department } from '../../../../domain/departments/entities/department.entity';
import { DepartmentNotFoundException } from '../../../../domain/departments/exceptions/department.exceptions';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { DeleteDepartmentCommand } from './delete-department.command';
import { DeleteDepartmentUseCase } from './delete-department.use-case';

describe('DeleteDepartmentUseCase', () => {
    let useCase: DeleteDepartmentUseCase;
    let departmentRepository: jest.Mocked<DepartmentRepositoryPort>;

    const existingDepartment: Department = new Department(
        1,
        'Antioquia',
        'ANT',
        new Date('2026-01-01'),
        new Date('2026-01-01'),
    );

    beforeEach(async () => {
        departmentRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByCode: jest.fn(),
            findAll: jest.fn(),
            findPaginated: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeleteDepartmentUseCase,
                { provide: DEPARTMENT_REPOSITORY, useValue: departmentRepository },
            ],
        }).compile();
        useCase = module.get(DeleteDepartmentUseCase);
    });

    it('should soft-delete department when it exists', async () => {
        departmentRepository.findById.mockResolvedValue(existingDepartment);
        departmentRepository.softDelete.mockResolvedValue(undefined);
        await useCase.execute(new DeleteDepartmentCommand(1));
        expect(departmentRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw when department does not exist', async () => {
        departmentRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new DeleteDepartmentCommand(99))).rejects.toThrow(
            DepartmentNotFoundException,
        );
        expect(departmentRepository.softDelete).not.toHaveBeenCalled();
    });
});
