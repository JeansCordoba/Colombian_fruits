import { Department } from "../../../domain/department/entities/department.entity";
import { DepartmentOrmEntity } from "./department.orm-entity";


/**
 * Mapper for the Department entity.
 */
export class DepartmentMapper {
    /**
     * Convert a DepartmentOrmEntity to a Department.
     * @param orm - The DepartmentOrmEntity to convert.
     * @returns The converted Department.
     */
    static toDomain(orm: DepartmentOrmEntity): Department {
        return new Department(
            orm.id,
            orm.name,
            orm.code,
            orm.createdAt,
            orm.updatedAt,
        );
    }
    /**
     * Convert a Department to a DepartmentOrmEntity.
     * @param domain - The Department to convert.
     * @returns The converted DepartmentOrmEntity.
     */
    static toPersistence(domain: Department): DepartmentOrmEntity {
        const orm = new DepartmentOrmEntity();
        if (domain.id > 0) {
            orm.id = domain.id;
        }
        orm.name = domain.name;
        orm.code = domain.code;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}