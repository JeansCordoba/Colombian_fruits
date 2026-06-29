import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HarvestSeason } from '../../../domain/harvest-seasons/entities/harvest-season.entity';
import { HarvestSeasonRepositoryPort } from '../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HarvestSeasonMapper } from './harvest-season.mapper';
import { HarvestSeasonOrmEntity } from './harvest-season.orm-entity';

@Injectable()
export class HarvestSeasonRepository implements HarvestSeasonRepositoryPort {
    constructor(
        @InjectRepository(HarvestSeasonOrmEntity)
        private readonly ormRepository: Repository<HarvestSeasonOrmEntity>,
    ) {}

    async save(harvestSeason: HarvestSeason): Promise<HarvestSeason> {
        const orm = HarvestSeasonMapper.toPersistence(harvestSeason);
        const savedOrm = await this.ormRepository.save(orm);
        return HarvestSeasonMapper.toDomain(savedOrm);
    }

    async findById(id: number): Promise<HarvestSeason | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? HarvestSeasonMapper.toDomain(orm) : null;
    }

    async findAll(): Promise<HarvestSeason[]> {
        const orms = await this.ormRepository.find({ order: { id: 'ASC' } });
        return orms.map((orm) => HarvestSeasonMapper.toDomain(orm));
    }

    async findPaginated(page: number, limit: number): Promise<HarvestSeason[]> {
        const skip = (page - 1) * limit;
        const orms = await this.ormRepository.find({
            skip,
            take: limit,
            order: { id: 'ASC' },
        });
        return orms.map((orm) => HarvestSeasonMapper.toDomain(orm));
    }

    async count(): Promise<number> {
        return this.ormRepository.count();
    }

    async update(harvestSeason: HarvestSeason): Promise<HarvestSeason> {
        const orm = HarvestSeasonMapper.toPersistence(harvestSeason);
        await this.ormRepository.update(orm.id, orm);
        return harvestSeason;
    }

    async softDelete(id: number): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
}
