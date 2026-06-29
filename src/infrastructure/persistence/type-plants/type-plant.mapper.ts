import { TypePlant } from '../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantOrmEntity } from './type-plant.orm-entity';

/**
 * Mapper for the TypePlant entity.
 */
export class TypePlantMapper {
    static toDomain(orm: TypePlantOrmEntity): TypePlant {
        return new TypePlant(
            orm.id,
            orm.name,
            orm.createdAt,
            orm.updatedAt,
        );
    }

    static toPersistence(domain: TypePlant): TypePlantOrmEntity {
        const orm = new TypePlantOrmEntity();
        if (domain.id > 0) {
            orm.id = domain.id;
        }
        orm.name = domain.name;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}
