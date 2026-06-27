import { Department } from '../entities/department.entity';

/**
 * Repository port for the department entity.
 */
export interface DepartmentRepositoryPort {
    save(department: Department): Promise<Department>;
    findById(id: number): Promise<Department | null>;
    findByCode(code: string): Promise<Department | null>;
    findAll(): Promise<Department[]>;
    findPaginated(page: number, limit: number): Promise<Department[]>;
    count(): Promise<number>;
    update(department: Department): Promise<Department>;
    delete(id: number): Promise<void>;
}
