import { Test, TestingModule } from '@nestjs/testing';
import { Department } from '../../../../domain/departments/entities/department.entity';
import {
    DepartmentNotFoundException,
    DuplicateDepartmentCodeException,
} from '../../../../domain/departments/exceptions/department.exceptions';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { UpdateDepartmentCommand } from './update-department.command';
import { UpdateDepartmentUseCase } from './update-department.use-case';

describe('UpdateDepartmentUseCase', () => {
    let useCase: UpdateDepartmentUseCase;
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
            delete: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateDepartmentUseCase,
                { provide: DEPARTMENT_REPOSITORY, useValue: departmentRepository },
            ],
        }).compile();
        useCase = module.get(UpdateDepartmentUseCase);
    });

    it('should update department when it exists', async () => {
        const inputCommand = new UpdateDepartmentCommand(1, 'Antioquia Updated', 'ANT');
        departmentRepository.findById.mockResolvedValue(existingDepartment);
        departmentRepository.update.mockResolvedValue(
            new Department(1, 'Antioquia Updated', 'ANT', existingDepartment.createdAt, new Date('2026-02-01')),
        );
        const actualDepartment = await useCase.execute(inputCommand);
        expect(actualDepartment.name).toBe('Antioquia Updated');
    });

    it('should throw when department does not exist', async () => {
        departmentRepository.findById.mockResolvedValue(null);
        await expect(
            useCase.execute(new UpdateDepartmentCommand(99, 'Test', 'TST')),
        ).rejects.toThrow(DepartmentNotFoundException);
    });

    it('should throw when new code already exists', async () => {
        departmentRepository.findById.mockResolvedValue(existingDepartment);
        departmentRepository.findByCode.mockResolvedValue(
            new Department(2, 'Cundinamarca', 'CUN', new Date('2026-01-01'), new Date('2026-01-01')),
        );
        await expect(
            useCase.execute(new UpdateDepartmentCommand(1, 'Antioquia', 'CUN')),
        ).rejects.toThrow(DuplicateDepartmentCodeException);
    });
});
