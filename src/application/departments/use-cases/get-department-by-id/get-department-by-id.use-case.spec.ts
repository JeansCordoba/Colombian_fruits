import { Test, TestingModule } from '@nestjs/testing';
import { Department } from '../../../../domain/departments/entities/department.entity';
import { DepartmentNotFoundException } from '../../../../domain/departments/exceptions/department.exceptions';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { GetDepartmentByIdQuery } from './get-department-by-id.query';
import { GetDepartmentByIdUseCase } from './get-department-by-id.use-case';

describe('GetDepartmentByIdUseCase', () => {
    let useCase: GetDepartmentByIdUseCase;
    let departmentRepository: jest.Mocked<DepartmentRepositoryPort>;

    const department: Department = new Department(
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
                GetDepartmentByIdUseCase,
                { provide: DEPARTMENT_REPOSITORY, useValue: departmentRepository },
            ],
        }).compile();
        useCase = module.get(GetDepartmentByIdUseCase);
    });

    it('should return department when it exists', async () => {
        departmentRepository.findById.mockResolvedValue(department);
        const actualDepartment = await useCase.execute(new GetDepartmentByIdQuery(1));
        expect(actualDepartment).toEqual(department);
    });

    it('should throw when department does not exist', async () => {
        departmentRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new GetDepartmentByIdQuery(99))).rejects.toThrow(
            DepartmentNotFoundException,
        );
    });
});
