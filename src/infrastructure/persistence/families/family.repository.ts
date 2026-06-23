import { InjectRepository } from "@nestjs/typeorm";
import { Family } from "../../../domain/families/entities/family.entity";
import { FamilyRepositoryPort } from "../../../domain/families/repositories/family.repository.port";
import { FamilyMapper } from "./family.mapper";
import { FamilyOrmEntity } from "./family.orm-entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FamilyRepository implements FamilyRepositoryPort {
    constructor(
        @InjectRepository(FamilyOrmEntity)
        private readonly ormRepository: Repository<FamilyOrmEntity>,
    ) {}
    async save(family: Family): Promise<Family> {
        const orm = FamilyMapper.toPersistence(family);
        await this.ormRepository.save(orm);
        return FamilyMapper.toDomain(orm);
    }
    async findById(id: number): Promise<Family | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? FamilyMapper.toDomain(orm) : null;
    }
    async findAll(): Promise<Family[]> {
        const orms = await this.ormRepository.find();
        return orms.map(orm => FamilyMapper.toDomain(orm));
    }
    async update(family: Family): Promise<Family> {
        const orm = FamilyMapper.toPersistence(family);
        await this.ormRepository.save(orm);
        return FamilyMapper.toDomain(orm);
    }
}