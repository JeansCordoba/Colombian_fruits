import { Module } from "@nestjs/common";
import { CreateDepartmentUseCase } from "../application/department/use-cases/create-department/create-department.use-case";
import { DepartmentRepository } from "../infrastructure/persistence/department/department.repository";
import { DEPARTMENT_REPOSITORY } from "../domain/department/repositories/department.repository.token";

@Module({
    imports: [],
    controllers: [
        CreateDepartmentController,
    ],
    providers: [
        CreateDepartmentUseCase,
        {
            provide: DEPARTMENT_REPOSITORY,
            useClass: DepartmentRepository,
        },
    ],
})
export class AppModule {}