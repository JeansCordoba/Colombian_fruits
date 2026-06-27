import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateDepartmentUseCase } from '../../../application/departments/use-cases/create-department/create-department.use-case';
import { DeleteDepartmentUseCase } from '../../../application/departments/use-cases/delete-department/delete-department.use-case';
import { GetDepartmentByIdUseCase } from '../../../application/departments/use-cases/get-department-by-id/get-department-by-id.use-case';
import { ListDepartmentsUseCase } from '../../../application/departments/use-cases/list-departments/list-departments.use-case';
import { UpdateDepartmentUseCase } from '../../../application/departments/use-cases/update-department/update-department.use-case';
import { DEPARTMENT_REPOSITORY } from '../../../domain/departments/repositories/department.repository.token';
import { DepartmentOrmEntity } from '../../../infrastructure/persistence/departments/department.orm-entity';
import { DepartmentRepository } from '../../../infrastructure/persistence/departments/department.repository';
import { DepartmentsController } from './departments.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentOrmEntity])],
    controllers: [DepartmentsController],
    providers: [
        CreateDepartmentUseCase,
        GetDepartmentByIdUseCase,
        ListDepartmentsUseCase,
        UpdateDepartmentUseCase,
        DeleteDepartmentUseCase,
        {
            provide: DEPARTMENT_REPOSITORY,
            useClass: DepartmentRepository,
        },
    ],
})
export class DepartmentsModule {}
