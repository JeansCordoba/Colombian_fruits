import { Test, TestingModule } from '@nestjs/testing';
import { Department } from '../../../../domain/departments/entities/department.entity';
import { DepartmentRepositoryPort } from '../../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/departments/repositories/department.repository.token';
import { ListDepartmentsQuery } from './list-departments.query';
import { ListDepartmentsUseCase } from './list-departments.use-case';

describe('ListDepartmentsUseCase', () => {
    let useCase: ListDepartmentsUseCase;
    let departmentRepository: jest.Mocked<DepartmentRepositoryPort>;

    const departments: Department[] = [
        new Department(1, 'Antioquia', 'ANT', new Date('2026-01-01'), new Date('2026-01-01')),
    ];

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
                ListDepartmentsUseCase,
                { provide: DEPARTMENT_REPOSITORY, useValue: departmentRepository },
            ],
        }).compile();
        useCase = module.get(ListDepartmentsUseCase);
    });

    it('should return paginated departments', async () => {
        departmentRepository.findPaginated.mockResolvedValue(departments);
        departmentRepository.count.mockResolvedValue(1);
        const actualResult = await useCase.execute(new ListDepartmentsQuery(1, 20));
        expect(actualResult.data).toEqual(departments);
        expect(actualResult.meta).toEqual({
            total: 1,
            page: 1,
            limit: 20,
            totalPages: 1,
        });
    });

    it('should cap limit to max allowed value', async () => {
        departmentRepository.findPaginated.mockResolvedValue([]);
        departmentRepository.count.mockResolvedValue(0);
        await useCase.execute(new ListDepartmentsQuery(1, 500));
        expect(departmentRepository.findPaginated).toHaveBeenCalledWith(1, 100);
    });
});
