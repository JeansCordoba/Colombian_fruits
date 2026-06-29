import { TypePlant } from '../entities/type-plant.entity';

/**
 * Repository port for the type plant entity.
 */
export interface TypePlantRepositoryPort {
    /**
     * Save a type plant.
     * @param typePlant - The type plant to save.
     * @returns The saved type plant.
     */
    save(typePlant: TypePlant): Promise<TypePlant>;
    /**
     * Find a type plant by its id.
     * @param id - The id of the type plant to find.
     * @returns The found type plant or null if not found.
     */
    findById(id: number): Promise<TypePlant | null>;
    /**
     * Find all type plants.
     * @returns All type plants.
     */
    findAll(): Promise<TypePlant[]>;
    /**
     * Find paginated type plants.
     * @param page - The page number.
     * @param limit - The number of type plants per page.
     * @returns The paginated type plants.
     */
    findPaginated(page: number, limit: number): Promise<TypePlant[]>;
    /**
     * Count the number of type plants.
     * @returns The number of type plants.
     */
    count(): Promise<number>;
    /**
     * Update a type plant.
     * @param typePlant - The type plant to update.
     * @returns The updated type plant.
     */
    update(typePlant: TypePlant): Promise<TypePlant>;
    /**
     * Soft-delete a type plant by its id (sets deleted_at).
     * @param id - The id of the type plant to soft-delete.
     */
    softDelete(id: number): Promise<void>;
}
