import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Climate } from '../../../domain/climates/entities/climate.entity';
import { ClimateRepositoryPort } from '../../../domain/climates/repositories/climate.repository.port';
import { ClimateMapper } from './climate.mapper';
import { ClimateOrmEntity } from './climate.orm-entity';

@Injectable()
export class ClimateRepository implements ClimateRepositoryPort {
    constructor(
        @InjectRepository(ClimateOrmEntity)
        private readonly ormRepository: Repository<ClimateOrmEntity>,
    ) {}

    async save(climate: Climate): Promise<Climate> {
        const orm = ClimateMapper.toPersistence(climate);
        const savedOrm = await this.ormRepository.save(orm);
        return ClimateMapper.toDomain(savedOrm);
    }

    async findById(id: number): Promise<Climate | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? ClimateMapper.toDomain(orm) : null;
    }

    async findAll(): Promise<Climate[]> {
        const orms = await this.ormRepository.find({ order: { id: 'ASC' } });
        return orms.map((orm) => ClimateMapper.toDomain(orm));
    }

    async findPaginated(page: number, limit: number): Promise<Climate[]> {
        const skip = (page - 1) * limit;
        const orms = await this.ormRepository.find({
            skip,
            take: limit,
            order: { id: 'ASC' },
        });
        return orms.map((orm) => ClimateMapper.toDomain(orm));
    }

    async count(): Promise<number> {
        return this.ormRepository.count();
    }

    async update(climate: Climate): Promise<Climate> {
        const orm = ClimateMapper.toPersistence(climate);
        await this.ormRepository.update(orm.id, orm);
        return climate;
    }

    async softDelete(id: number): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
}
