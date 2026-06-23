import { Inject, Injectable } from "@nestjs/common";
import { CreateDepartmentCommand } from "./create-department.command";
import { DepartmentRepositoryPort } from "../../../../domain/department/repositories/department.repository.port";
import { DEPARTMENT_REPOSITORY } from "../../../../domain/department/repositories/department.repository.token";
import { Department } from "../../../../domain/department/entities/department.entity";
import { DuplicateDepartmentCodeException, DuplicateDepartmentNameException } from "../../../../domain/department/exceptions/department.exception";

@Injectable()
export class CreateDepartmentUseCase {
    constructor(
        @Inject(DEPARTMENT_REPOSITORY)
        private readonly departmentRepository: DepartmentRepositoryPort,
    ) {}
    async execute(command: CreateDepartmentCommand): Promise<Department> {
        const departmentAlreadyExists = await this.departmentRepository.findByCode(command.code);
        if (departmentAlreadyExists) {
            throw new DuplicateDepartmentCodeException(command.code);
        }
        if (departmentAlreadyExists.name === command.name) {
            throw new DuplicateDepartmentNameException(command.name);
        }
        const department = new Department(
            0,
            command.name,
            command.code,
            new Date(),
            new Date(),
        );
        return this.departmentRepository.save(department);
    }
}