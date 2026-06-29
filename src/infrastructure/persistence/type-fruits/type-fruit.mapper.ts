import { TypeFruit } from "../../../domain/type-fruits/entities/type-fruit.entity";
import { TypeFruitOrmEntity } from "./type-fruit.orm-entity";


/**
 * Mapper for the TypeFruit entity.
 */
export class TypeFruitMapper {
    static toDomain(orm: TypeFruitOrmEntity): TypeFruit {
        return new TypeFruit(
            orm.id,
            orm.name,
            orm.description ?? null,
            orm.createdAt,
            orm.updatedAt,
        );
    }
    static toPersistence(domain: TypeFruit): TypeFruitOrmEntity {
        const orm = new TypeFruitOrmEntity();
        if (domain.id > 0) {
            orm.id = domain.id;
        }
        orm.name = domain.name;
        orm.description = domain.description ?? null;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}