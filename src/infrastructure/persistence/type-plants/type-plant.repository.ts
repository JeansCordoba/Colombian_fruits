import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypePlant } from '../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantRepositoryPort } from '../../../domain/type-plants/repositories/type-plant.repository.port';
import { TypePlantMapper } from './type-plant.mapper';
import { TypePlantOrmEntity } from './type-plant.orm-entity';

@Injectable()
export class TypePlantRepository implements TypePlantRepositoryPort {
    constructor(
        @InjectRepository(TypePlantOrmEntity)
        private readonly ormRepository: Repository<TypePlantOrmEntity>,
    ) {}

    async save(typePlant: TypePlant): Promise<TypePlant> {
        const orm = TypePlantMapper.toPersistence(typePlant);
        const savedOrm = await this.ormRepository.save(orm);
        return TypePlantMapper.toDomain(savedOrm);
    }

    async findById(id: number): Promise<TypePlant | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? TypePlantMapper.toDomain(orm) : null;
    }

    async findAll(): Promise<TypePlant[]> {
        const orms = await this.ormRepository.find({ order: { id: 'ASC' } });
        return orms.map((orm) => TypePlantMapper.toDomain(orm));
    }

    async findPaginated(page: number, limit: number): Promise<TypePlant[]> {
        const skip = (page - 1) * limit;
        const orms = await this.ormRepository.find({
            skip,
            take: limit,
            order: { id: 'ASC' },
        });
        return orms.map((orm) => TypePlantMapper.toDomain(orm));
    }

    async count(): Promise<number> {
        return this.ormRepository.count();
    }

    async update(typePlant: TypePlant): Promise<TypePlant> {
        const orm = TypePlantMapper.toPersistence(typePlant);
        await this.ormRepository.update(orm.id, orm);
        return typePlant;
    }

    async softDelete(id: number): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
}
