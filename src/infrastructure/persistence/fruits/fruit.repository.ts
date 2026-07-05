import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, ILike, Repository } from 'typeorm';
import { Fruit } from '../../../domain/fruits/entities/fruit.entity';
import { FruitListItem, FruitWithRelations } from '../../../domain/fruits/read-models/fruit-with-relations.read-model';
import { FruitRelations, FruitRepositoryPort } from '../../../domain/fruits/repositories/fruit.repository.port';
import { FruitClimateOrmEntity } from './fruit-climate.orm-entity';
import { FruitDepartmentOrmEntity } from './fruit-department.orm-entity';
import { FruitHarvestSeasonOrmEntity } from './fruit-harvest-season.orm-entity';
import { FruitNaturalRegionOrmEntity } from './fruit-natural-region.orm-entity';
import { FruitMapper } from './fruit.mapper';
import { FruitOrmEntity } from './fruit.orm-entity';

@Injectable()
export class FruitRepository implements FruitRepositoryPort {
    constructor(
        @InjectRepository(FruitOrmEntity)
        private readonly ormRepository: Repository<FruitOrmEntity>,
        @InjectRepository(FruitClimateOrmEntity)
        private readonly fruitClimateRepository: Repository<FruitClimateOrmEntity>,
        @InjectRepository(FruitDepartmentOrmEntity)
        private readonly fruitDepartmentRepository: Repository<FruitDepartmentOrmEntity>,
        @InjectRepository(FruitNaturalRegionOrmEntity)
        private readonly fruitNaturalRegionRepository: Repository<FruitNaturalRegionOrmEntity>,
        @InjectRepository(FruitHarvestSeasonOrmEntity)
        private readonly fruitHarvestSeasonRepository: Repository<FruitHarvestSeasonOrmEntity>,
        private readonly dataSource: DataSource,
    ) {}

    async save(fruit: Fruit, relations: FruitRelations): Promise<Fruit> {
        return this.dataSource.transaction(async (manager) => {
            const fruitRepo = manager.getRepository(FruitOrmEntity);
            const orm = FruitMapper.toPersistence(fruit);
            const savedOrm = await fruitRepo.save(orm);
            await this.replaceBridgeRows(manager, savedOrm.id, relations);
            return FruitMapper.toDomain(savedOrm);
        });
    }

    async findById(id: number): Promise<Fruit | null> {
        const orm = await this.ormRepository.findOne({ where: { id } });
        return orm ? FruitMapper.toDomain(orm) : null;
    }

    async findByIdWithRelations(id: number): Promise<FruitWithRelations | null> {
        const orm = await this.ormRepository.findOne({
            where: { id },
            relations: { family: { typePlant: true }, typeFruit: true },
        });
        if (!orm) {
            return null;
        }
        const [climates, departments, naturalRegions, harvestSeasons] = await Promise.all([
            this.fruitClimateRepository.find({
                where: { fruitId: id },
                relations: { climate: true },
            }),
            this.fruitDepartmentRepository.find({
                where: { fruitId: id },
                relations: { department: true },
            }),
            this.fruitNaturalRegionRepository.find({
                where: { fruitId: id },
                relations: { naturalRegion: true },
            }),
            this.fruitHarvestSeasonRepository.find({
                where: { fruitId: id },
                relations: { harvestSeason: true },
            }),
        ]);
        return FruitMapper.toWithRelations({ orm, climates, departments, naturalRegions, harvestSeasons });
    }

    async findByScientificName(scientificName: string): Promise<Fruit | null> {
        const orm = await this.ormRepository.findOne({ where: { scientificName } });
        return orm ? FruitMapper.toDomain(orm) : null;
    }

    async findPaginated(page: number, limit: number, search?: string): Promise<FruitListItem[]> {
        const skip = (page - 1) * limit;
        const orms = await this.ormRepository.find({
            skip,
            take: limit,
            order: { id: 'ASC' },
            relations: { family: true },
            where: this.buildSearchWhere(search),
        });
        return orms.map((orm) => ({
            id: orm.id,
            commonName: orm.commonName,
            scientificName: orm.scientificName,
            family: { id: orm.family.id, name: orm.family.name },
            createdAt: orm.createdAt,
        }));
    }

    async count(search?: string): Promise<number> {
        return this.ormRepository.count({ where: this.buildSearchWhere(search) });
    }

    async update(fruit: Fruit, relations: FruitRelations): Promise<Fruit> {
        return this.dataSource.transaction(async (manager) => {
            const fruitRepo = manager.getRepository(FruitOrmEntity);
            const orm = FruitMapper.toPersistence(fruit);
            const savedOrm = await fruitRepo.save(orm);
            await this.replaceBridgeRows(manager, savedOrm.id, relations);
            return FruitMapper.toDomain(savedOrm);
        });
    }

    async softDelete(id: number): Promise<void> {
        await this.ormRepository.softDelete(id);
    }

    private buildSearchWhere(search?: string): object | object[] | undefined {
        if (!search || search.trim().length === 0) {
            return undefined;
        }
        const pattern = `%${search.trim()}%`;
        return [
            { commonName: ILike(pattern) },
            { scientificName: ILike(pattern) },
        ];
    }

    private async replaceBridgeRows(
        manager: EntityManager,
        fruitId: number,
        relations: FruitRelations,
    ): Promise<void> {
        await manager.getRepository(FruitClimateOrmEntity).delete({ fruitId });
        await manager.getRepository(FruitDepartmentOrmEntity).delete({ fruitId });
        await manager.getRepository(FruitNaturalRegionOrmEntity).delete({ fruitId });
        await manager.getRepository(FruitHarvestSeasonOrmEntity).delete({ fruitId });
        if (relations.climateIds.length > 0) {
            await manager.getRepository(FruitClimateOrmEntity).save(
                relations.climateIds.map((climateId) => ({ fruitId, climateId })),
            );
        }
        if (relations.departmentIds.length > 0) {
            await manager.getRepository(FruitDepartmentOrmEntity).save(
                relations.departmentIds.map((departmentId) => ({ fruitId, departmentId })),
            );
        }
        if (relations.naturalRegionIds.length > 0) {
            await manager.getRepository(FruitNaturalRegionOrmEntity).save(
                relations.naturalRegionIds.map((naturalRegionId) => ({ fruitId, naturalRegionId })),
            );
        }
        if (relations.harvestSeasonIds.length > 0) {
            await manager.getRepository(FruitHarvestSeasonOrmEntity).save(
                relations.harvestSeasonIds.map((harvestSeasonId) => ({ fruitId, harvestSeasonId })),
            );
        }
    }
}
