import { NaturalRegion } from '../../../domain/natural-regions/entities/natural-region.entity';
import { NaturalRegionOrmEntity } from './natural-region.orm-entity';

/**
 * Mapper for the NaturalRegion entity.
 */
export class NaturalRegionMapper {
    static toDomain(orm: NaturalRegionOrmEntity): NaturalRegion {
        return new NaturalRegion(
            orm.id,
            orm.name,
            orm.createdAt,
            orm.updatedAt,
        );
    }

    static toPersistence(domain: NaturalRegion): NaturalRegionOrmEntity {
        const orm = new NaturalRegionOrmEntity();
        if (domain.id > 0) {
            orm.id = domain.id;
        }
        orm.name = domain.name;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}
