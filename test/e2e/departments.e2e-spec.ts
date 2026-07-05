import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { CreateDepartmentUseCase } from '../../src/application/departments/use-cases/create-department/create-department.use-case';
import { DeleteDepartmentUseCase } from '../../src/application/departments/use-cases/delete-department/delete-department.use-case';
import { GetDepartmentByIdUseCase } from '../../src/application/departments/use-cases/get-department-by-id/get-department-by-id.use-case';
import { ListDepartmentsUseCase } from '../../src/application/departments/use-cases/list-departments/list-departments.use-case';
import { UpdateDepartmentUseCase } from '../../src/application/departments/use-cases/update-department/update-department.use-case';
import { Department } from '../../src/domain/departments/entities/department.entity';
import { DEPARTMENT_REPOSITORY } from '../../src/domain/departments/repositories/department.repository.token';
import { DomainExceptionFilter } from '../../src/interfaces/http/shared/filters/domain-exception.filter';
import { UnhandledExceptionFilter } from '../../src/interfaces/http/shared/filters/unhandled-exception.filter';
import { DepartmentsController } from '../../src/interfaces/http/departments/departments.controller';

describe('DepartmentsController (e2e)', () => {
    let app: INestApplication;
    let departmentRepository: {
        save: jest.Mock;
        findById: jest.Mock;
        findByCode: jest.Mock;
        findAll: jest.Mock;
        findPaginated: jest.Mock;
        count: jest.Mock;
        update: jest.Mock;
        softDelete: jest.Mock;
    };

    const mockDepartment: Department = new Department(
        1,
        'Cundinamarca',
        'CUN',
        new Date('2026-01-01T00:00:00.000Z'),
        new Date('2026-01-01T00:00:00.000Z'),
    );

    beforeAll(async () => {
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
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [DepartmentsController],
            providers: [
                CreateDepartmentUseCase,
                GetDepartmentByIdUseCase,
                ListDepartmentsUseCase,
                UpdateDepartmentUseCase,
                DeleteDepartmentUseCase,
                { provide: DEPARTMENT_REPOSITORY, useValue: departmentRepository },
            ],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api/v1');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
            }),
        );
        app.useGlobalFilters(new UnhandledExceptionFilter(), new DomainExceptionFilter());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /api/v1/departments/:id returns the standard success envelope', async () => {
        departmentRepository.findById.mockResolvedValue(mockDepartment);
        const response = await request(app.getHttpServer()).get('/api/v1/departments/1').expect(200);
        expect(response.body).toMatchObject({
            success: true,
            statusCode: 200,
            data: {
                id: 1,
                name: 'Cundinamarca',
            },
        });
    });

    it('POST /api/v1/departments returns 201 with the standard success envelope', async () => {
        departmentRepository.save.mockResolvedValue(mockDepartment);
        const response = await request(app.getHttpServer())
            .post('/api/v1/departments')
            .send({ name: 'Cundinamarca', code: 'CUN' })
            .expect(201);
        expect(response.body).toMatchObject({
            success: true,
            statusCode: 201,
            data: {
                id: 1,
                name: 'Cundinamarca',
            },
        });
    });
});
