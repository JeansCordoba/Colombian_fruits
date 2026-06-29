import { Climate } from '../entities/climate.entity';

/**
 * Repository port for the climate entity.
 */
export interface ClimateRepositoryPort {
    /**
     * Save a climate.
     * @param climate - The climate to save.
     * @returns The saved climate.
     */
    save(climate: Climate): Promise<Climate>;
    /**
     * Find a climate by its id.
     * @param id - The id of the climate to find.
     * @returns The found climate or null if not found.
     */
    findById(id: number): Promise<Climate | null>;
    /**
     * Find all climates.
     * @returns All climates.
     */
    findAll(): Promise<Climate[]>;
    /**
     * Find paginated climates.
     * @param page - The page number.
     * @param limit - The number of climates per page.
     * @returns The paginated climates.
     */
    findPaginated(page: number, limit: number): Promise<Climate[]>;
    /**
     * Count the number of climates.
     * @returns The number of climates.
     */
    count(): Promise<number>;
    /**
     * Update a climate.
     * @param climate - The climate to update.
     * @returns The updated climate.
     */
    update(climate: Climate): Promise<Climate>;
    /**
     * Soft-delete a climate by its id (sets deleted_at).
     * @param id - The id of the climate to soft-delete.
     */
    softDelete(id: number): Promise<void>;
}
