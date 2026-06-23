import { Department } from "../entities/department.entity";

/**
 * Repository port for the department entity.
 */
export interface DepartmentRepositoryPort {
    /**
     * Save a department.
     * @param department - The department to save.
     * @returns The saved department.
     */
    save(department: Department): Promise<Department>;
    /**
     * Find a department by its id.
     * @param id - The id of the department to find.
     * @returns The found department or null if not found.
     */
    findById(id: number): Promise<Department | null>;
    /**
     * Find a department by its code.
     * @param code - The code of the department to find.
     * @returns The found department or null if not found.
     */
    findByCode(code: string): Promise<Department | null>;
    /**
     * Find all departments.
     * @returns All departments.
     */
    findAll(): Promise<Department[]>;
    /**
     * Update a department.
     * @param department - The department to update.
     * @returns The updated department.
     */
    update(department: Department): Promise<Department>;
}