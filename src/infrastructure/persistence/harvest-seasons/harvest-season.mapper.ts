import { HarvestSeason } from '../../../domain/harvest-seasons/entities/harvest-season.entity';
import { HarvestSeasonOrmEntity } from './harvest-season.orm-entity';

/**
 * Mapper for the HarvestSeason entity.
 */
export class HarvestSeasonMapper {
    static toDomain(orm: HarvestSeasonOrmEntity): HarvestSeason {
        return new HarvestSeason(
            orm.id,
            orm.startMonth,
            orm.endMonth,
            orm.createdAt,
            orm.updatedAt,
        );
    }

    static toPersistence(domain: HarvestSeason): HarvestSeasonOrmEntity {
        const orm = new HarvestSeasonOrmEntity();
        if (domain.id > 0) {
            orm.id = domain.id;
        }
        orm.startMonth = domain.startMonth;
        orm.endMonth = domain.endMonth;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}
