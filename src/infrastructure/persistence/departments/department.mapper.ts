import { Department } from '../../../domain/departments/entities/department.entity';
import { DepartmentOrmEntity } from './department.orm-entity';

/**
 * Mapper for the Department entity.
 */
export class DepartmentMapper {
    static toDomain(orm: DepartmentOrmEntity): Department {
        return new Department(
            orm.id,
            orm.name,
            orm.code,
            orm.createdAt,
            orm.updatedAt,
        );
    }

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
