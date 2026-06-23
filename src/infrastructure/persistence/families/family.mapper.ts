import { Family } from "../../../domain/families/entities/family.entity";
import { TypePlantOrmEntity } from "../type-plants/type-plant.orm-entity";
import { FamilyOrmEntity } from "./family.orm-entity";


/**
 * Mapper for the Family entity.
 */
export class FamilyMapper {
    /**
     * Convert a FamilyOrmEntity to a Family.
     * @param orm - The FamilyOrmEntity to convert.
     * @returns The converted Family.
     */
    static toDomain(orm: FamilyOrmEntity): Family {
        return new Family(
            orm.id,
            orm.name,
            orm.typePlantId,
            orm.createdAt,
            orm.updatedAt,
        );
    }
    /**
     * Convert a Family to a FamilyOrmEntity.
     * @param domain - The Family to convert.
     * @returns The converted FamilyOrmEntity.
     */
    static toPersistence(domain: Family): FamilyOrmEntity {
        const orm = new FamilyOrmEntity();
        if (domain.id > 0) {
            orm.id = domain.id;
        }
        orm.name = domain.name;
        orm.typePlant = { id: domain.typePlantId } as TypePlantOrmEntity;
        orm.typePlantId = domain.typePlantId;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}