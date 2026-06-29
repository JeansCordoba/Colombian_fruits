import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../../domain/departments/entities/department.entity';
import { DepartmentRepositoryPort } from '../../../domain/departments/repositories/department.repository.port';
import { DepartmentMapper } from './department.mapper';
import { DepartmentOrmEntity } from './department.orm-entity';

@Injectable()
export class DepartmentRepository implements DepartmentRepositoryPort {
    constructor(
        @InjectRepository(DepartmentOrmEntity)
        private readonly ormRepository: Repository<DepartmentOrmEntity>,
    ) {}

    async save(department: Department): Promise<Department> {
        const orm = DepartmentMapper.toPersistence(department);
        const savedOrm = await this.ormRepository.save(orm);
        return DepartmentMapper.toDomain(savedOrm);
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
        const orms = await this.ormRepository.find({ order: { id: 'ASC' } });
        return orms.map((orm) => DepartmentMapper.toDomain(orm));
    }

    async findPaginated(page: number, limit: number): Promise<Department[]> {
        const skip = (page - 1) * limit;
        const orms = await this.ormRepository.find({
            skip,
            take: limit,
            order: { id: 'ASC' },
        });
        return orms.map((orm) => DepartmentMapper.toDomain(orm));
    }

    async count(): Promise<number> {
        return this.ormRepository.count();
    }

    async update(department: Department): Promise<Department> {
        const orm = DepartmentMapper.toPersistence(department);
        await this.ormRepository.update(orm.id, orm);
        return department;
    }

    async softDelete(id: number): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
}
