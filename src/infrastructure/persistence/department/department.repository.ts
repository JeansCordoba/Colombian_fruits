import { Department } from "../../../domain/department/entities/department.entity";
import { DepartmentRepositoryPort } from "../../../domain/department/repositories/department.repository.port";
import { DepartmentMapper } from "./department.mapper";
import { DepartmentOrmEntity } from "./department.orm-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DepartmentRepository implements DepartmentRepositoryPort {
    constructor(
        @InjectRepository(DepartmentOrmEntity)
        private readonly ormRepository: Repository<DepartmentOrmEntity>,
    ) {}
    async save(department: Department): Promise<Department> {
        const orm = DepartmentMapper.toPersistence(department);
        await this.ormRepository.save(orm);
        return DepartmentMapper.toDomain(orm);
    }
    async findById(id: number): Promise<Department | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? DepartmentMapper.toDomain(orm) : null;
    }
    async findByCode(code: string): Promise<Department | null> {
        const orm = await this.ormRepository.findOne({ where: { code } });
        return orm ? DepartmentMapper.toDomain(orm) : null;
    }
    async findAll(): Promise<Department[]> {
        const orms = await this.ormRepository.find();
        return orms.map(orm => DepartmentMapper.toDomain(orm));
    }
    async update(department: Department): Promise<Department> {
        const orm = DepartmentMapper.toPersistence(department);
        await this.ormRepository.save(orm);
        return DepartmentMapper.toDomain(orm);
    }
}