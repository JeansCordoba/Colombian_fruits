import { Fruit } from "../../../domain/fruits/entities/fruit.entity";
import { FruitRelations, FruitRepositoryPort } from "../../../domain/fruits/repositories/fruit.repository.port";
import { FruitMapper } from "./fruit.mapper";
import { FruitOrmEntity } from "./fruit.orm-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FruitRepository implements FruitRepositoryPort {
    constructor(
        @InjectRepository(FruitOrmEntity)
        private readonly ormRepository: Repository<FruitOrmEntity>,
    ) {}
    async save(fruit: Fruit, relations: FruitRelations): Promise<Fruit> {
        const orm = FruitMapper.toPersistence(fruit);
        await this.ormRepository.save(orm);
        return FruitMapper.toDomain(orm);
    }
    async findById(id: number): Promise<Fruit | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? FruitMapper.toDomain(orm) : null;
    }
    async findByScientificName(scientificName: string): Promise<Fruit | null> {
        const orm = await this.ormRepository.findOne({ where: { scientificName } });
        return orm ? FruitMapper.toDomain(orm) : null;
    }
    async findAll(): Promise<Fruit[]> {
        const orms = await this.ormRepository.find();
        return orms.map(orm => FruitMapper.toDomain(orm));
    }
    async update(fruit: Fruit): Promise<Fruit> {
        const orm = FruitMapper.toPersistence(fruit);
        await this.ormRepository.save(orm);
        return FruitMapper.toDomain(orm);
    }
}
