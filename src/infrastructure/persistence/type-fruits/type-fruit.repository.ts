import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeFruit } from '../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitRepositoryPort } from '../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TypeFruitMapper } from './type-fruit.mapper';
import { TypeFruitOrmEntity } from './type-fruit.orm-entity';

@Injectable()
export class TypeFruitRepository implements TypeFruitRepositoryPort {
    constructor(
        @InjectRepository(TypeFruitOrmEntity)
        private readonly ormRepository: Repository<TypeFruitOrmEntity>,
    ) {}

    async save(typeFruit: TypeFruit): Promise<TypeFruit> {
        const orm = TypeFruitMapper.toPersistence(typeFruit);
        const savedOrm = await this.ormRepository.save(orm);
        return TypeFruitMapper.toDomain(savedOrm);
    }

    async findById(id: number): Promise<TypeFruit | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? TypeFruitMapper.toDomain(orm) : null;
    }

    async findAll(): Promise<TypeFruit[]> {
        const orms = await this.ormRepository.find({ order: { id: 'ASC' } });
        return orms.map((orm) => TypeFruitMapper.toDomain(orm));
    }

    async findPaginated(page: number, limit: number): Promise<TypeFruit[]> {
        const skip = (page - 1) * limit;
        const orms = await this.ormRepository.find({
            skip,
            take: limit,
            order: { id: 'ASC' },
        });
        return orms.map((orm) => TypeFruitMapper.toDomain(orm));
    }

    async count(): Promise<number> {
        return this.ormRepository.count();
    }

    async update(typeFruit: TypeFruit): Promise<TypeFruit> {
        const orm = TypeFruitMapper.toPersistence(typeFruit);
        await this.ormRepository.update(orm.id, orm);
        return typeFruit;
    }

    async softDelete(id: number): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
}
