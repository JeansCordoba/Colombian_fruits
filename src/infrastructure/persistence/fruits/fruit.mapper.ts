import { Fruit } from "../../../domain/fruits/entities/fruit.entity";
import { TypeFruitOrmEntity } from "../type-fruits/type-fruit.orm-entity";
import { FruitOrmEntity } from "./fruit.orm-entity"
import { FamilyOrmEntity } from "../families/family.orm-entity";

/**
 * Mapper for the Fruit entity.
 */
export class FruitMapper {
    static toDomain(orm: FruitOrmEntity): Fruit {
        return new Fruit(
            orm.id,
            orm.commonName,
            orm.scientificName,
            orm.description ?? null,
            orm.familyId,
            orm.typeFruitId,
            orm.createdAt,
            orm.updatedAt,
        );
    }
    static toPersistence(domain: Fruit): FruitOrmEntity {
        const orm = new FruitOrmEntity();
        if (domain.id > 0) {
            orm.id = domain.id;
        }
        orm.commonName = domain.commonName;
        orm.scientificName = domain.scientificName;
        orm.description = domain.description ?? null;
        orm.family = { id: domain.familyId } as FamilyOrmEntity;
        orm.typeFruit = { id: domain.typeFruitId } as TypeFruitOrmEntity;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm; 
    }
}