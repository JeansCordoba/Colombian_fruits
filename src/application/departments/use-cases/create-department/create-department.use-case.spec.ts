import { Test, TestingModule } from '@nestjs/testing';
import { Department } from '../../../../domain/departments/entities/department.entity';
import { DuplicateDepartmentCodeException } from '../../../../domain/departments/exceptions/department.exceptions';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { CreateDepartmentCommand } from './create-department.command';
import { CreateDepartmentUseCase } from './create-department.use-case';

describe('CreateDepartmentUseCase', () => {
    let useCase: CreateDepartmentUseCase;
    let departmentRepository: jest.Mocked<DepartmentRepositoryPort>;

    const inputCommand: CreateDepartmentCommand = new CreateDepartmentCommand('Antioquia', 'ANT');
    const savedDepartment: Department = new Department(
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
                CreateDepartmentUseCase,
                { provide: DEPARTMENT_REPOSITORY, useValue: departmentRepository },
            ],
        }).compile();
        useCase = module.get(CreateDepartmentUseCase);
    });

    it('should create a department when code is unique', async () => {
        departmentRepository.findByCode.mockResolvedValue(null);
        departmentRepository.save.mockResolvedValue(savedDepartment);
        const actualDepartment = await useCase.execute(inputCommand);
        expect(actualDepartment).toEqual(savedDepartment);
    });

    it('should throw when department code already exists', async () => {
        departmentRepository.findByCode.mockResolvedValue(savedDepartment);
        await expect(useCase.execute(inputCommand)).rejects.toThrow(DuplicateDepartmentCodeException);
        expect(departmentRepository.save).not.toHaveBeenCalled();
    });
});
