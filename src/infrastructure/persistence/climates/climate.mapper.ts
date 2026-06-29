import { Climate } from '../../../domain/climates/entities/climate.entity';
import { ClimateOrmEntity } from './climate.orm-entity';

/**
 * Mapper for the Climate entity.
 */
export class ClimateMapper {
    static toDomain(orm: ClimateOrmEntity): Climate {
        return new Climate(
            orm.id,
            orm.name,
            orm.createdAt,
            orm.updatedAt,
        );
    }

    static toPersistence(domain: Climate): ClimateOrmEntity {
        const orm = new ClimateOrmEntity();
        if (domain.id > 0) {
            orm.id = domain.id;
        }
        orm.name = domain.name;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}
