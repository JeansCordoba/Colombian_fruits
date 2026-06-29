import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NaturalRegion } from '../../../domain/natural-regions/entities/natural-region.entity';
import { NaturalRegionRepositoryPort } from '../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NaturalRegionMapper } from './natural-region.mapper';
import { NaturalRegionOrmEntity } from './natural-region.orm-entity';

@Injectable()
export class NaturalRegionRepository implements NaturalRegionRepositoryPort {
    constructor(
        @InjectRepository(NaturalRegionOrmEntity)
        private readonly ormRepository: Repository<NaturalRegionOrmEntity>,
    ) {}

    async save(naturalRegion: NaturalRegion): Promise<NaturalRegion> {
        const orm = NaturalRegionMapper.toPersistence(naturalRegion);
        const savedOrm = await this.ormRepository.save(orm);
        return NaturalRegionMapper.toDomain(savedOrm);
    }

    async findById(id: number): Promise<NaturalRegion | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? NaturalRegionMapper.toDomain(orm) : null;
    }

    async findAll(): Promise<NaturalRegion[]> {
        const orms = await this.ormRepository.find({ order: { id: 'ASC' } });
        return orms.map((orm) => NaturalRegionMapper.toDomain(orm));
    }

    async findPaginated(page: number, limit: number): Promise<NaturalRegion[]> {
        const skip = (page - 1) * limit;
        const orms = await this.ormRepository.find({
            skip,
            take: limit,
            order: { id: 'ASC' },
        });
        return orms.map((orm) => NaturalRegionMapper.toDomain(orm));
    }

    async count(): Promise<number> {
        return this.ormRepository.count();
    }

    async update(naturalRegion: NaturalRegion): Promise<NaturalRegion> {
        const orm = NaturalRegionMapper.toPersistence(naturalRegion);
        await this.ormRepository.update(orm.id, orm);
        return naturalRegion;
    }

    async softDelete(id: number): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
}
