import { Family } from "../entities/family.entity";

/**
 * Repository port for the family entity.
 */
export interface FamilyRepositoryPort{
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
     * Find all families.
     * @returns All families.
     */
    findAll(): Promise<Family[]>;
    /**
     * Update a family.
     * @param family - The family to update.
     * @returns The updated family.
     */
    update(family: Family): Promise<Family>;
}