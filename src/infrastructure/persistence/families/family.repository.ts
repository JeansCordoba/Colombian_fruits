import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from '../../../domain/families/entities/family.entity';
import { FamilyWithTypePlant } from '../../../domain/families/entities/family-with-type-plant';
import { FamilyRepositoryPort } from '../../../domain/families/repositories/family.repository.port';
import { FamilyMapper } from './family.mapper';
import { FamilyOrmEntity } from './family.orm-entity';

@Injectable()
export class FamilyRepository implements FamilyRepositoryPort {
    constructor(
        @InjectRepository(FamilyOrmEntity)
        private readonly ormRepository: Repository<FamilyOrmEntity>,
    ) {}

    async save(family: Family): Promise<Family> {
        const orm = FamilyMapper.toPersistence(family);
        const savedOrm = await this.ormRepository.save(orm);
        return FamilyMapper.toDomain(savedOrm);
    }

    async findById(id: number): Promise<Family | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? FamilyMapper.toDomain(orm) : null;
    }

    async findByIdWithTypePlant(id: number): Promise<FamilyWithTypePlant | null> {
        const orm = await this.ormRepository.findOne({
            where: { id },
            relations: { typePlant: true },
        });
        return orm ? FamilyMapper.toDomainWithTypePlant(orm) : null;
    }

    async findByName(name: string): Promise<Family | null> {
        const orm = await this.ormRepository.findOne({ where: { name } });
        return orm ? FamilyMapper.toDomain(orm) : null;
    }

    async findAll(): Promise<Family[]> {
        const orms = await this.ormRepository.find({ order: { id: 'ASC' } });
        return orms.map((orm) => FamilyMapper.toDomain(orm));
    }

    async findPaginated(page: number, limit: number): Promise<FamilyWithTypePlant[]> {
        const skip = (page - 1) * limit;
        const orms = await this.ormRepository.find({
            skip,
            take: limit,
            order: { id: 'ASC' },
            relations: { typePlant: true },
        });
        return orms.map((orm) => FamilyMapper.toDomainWithTypePlant(orm));
    }

    async count(): Promise<number> {
        return this.ormRepository.count();
    }

    async update(family: Family): Promise<Family> {
        const orm = FamilyMapper.toPersistence(family);
        await this.ormRepository.save(orm);
        return family;
    }

    async softDelete(id: number): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
}
