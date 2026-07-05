import { Family } from '../entities/family.entity';
import { FamilyWithTypePlant } from '../entities/family-with-type-plant';

/**
 * Repository port for the family entity.
 */
export interface FamilyRepositoryPort {
    /**
     * Save a family.
     * @param family - The family to save.
     * @returns The saved family.
     */
    save(family: Family): Promise<Family>;
    /**
     * Find a family by its id.
     * @param id - The id of the family to find.
     * @returns The found family or null if not found.
     */
    findById(id: number): Promise<Family | null>;
    /**
     * Find a family by its id including the related type plant name.
     * @param id - The id of the family to find.
     * @returns The found family with its type plant name or null if not found.
     */
    findByIdWithTypePlant(id: number): Promise<FamilyWithTypePlant | null>;
    /**
     * Find a family by its name.
     * @param name - The name of the family to find.
     * @returns The found family or null if not found.
     */
    findByName(name: string): Promise<Family | null>;
    /**
     * Find all families.
     * @returns All families.
     */
    findAll(): Promise<Family[]>;
    /**
     * Find paginated families including the related type plant name.
     * @param page - The page number.
     * @param limit - The number of families per page.
     * @returns The paginated families with their type plant names.
     */
    findPaginated(page: number, limit: number): Promise<FamilyWithTypePlant[]>;
    /**
     * Count the number of families.
     * @returns The number of families.
     */
    count(): Promise<number>;
    /**
     * Update a family.
     * @param family - The family to update.
     * @returns The updated family.
     */
    update(family: Family): Promise<Family>;
    /**
     * Soft-delete a family by its id (sets deleted_at).
     * @param id - The id of the family to soft-delete.
     */
    softDelete(id: number): Promise<void>;
}
