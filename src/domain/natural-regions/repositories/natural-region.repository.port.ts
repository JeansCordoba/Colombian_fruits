import { NaturalRegion } from '../entities/natural-region.entity';

/**
 * Repository port for the natural region entity.
 */
export interface NaturalRegionRepositoryPort {
    /**
     * Save a natural region.
     * @param naturalRegion - The natural region to save.
     * @returns The saved natural region.
     */
    save(naturalRegion: NaturalRegion): Promise<NaturalRegion>;
    /**
     * Find a natural region by its id.
     * @param id - The id of the natural region to find.
     * @returns The found natural region or null if not found.
     */
    findById(id: number): Promise<NaturalRegion | null>;
    /**
     * Find all natural regions.
     * @returns All natural regions.
     */
    findAll(): Promise<NaturalRegion[]>;
    /**
     * Find paginated natural regions.
     * @param page - The page number.
     * @param limit - The number of natural regions per page.
     * @returns The paginated natural regions.
     */
    findPaginated(page: number, limit: number): Promise<NaturalRegion[]>;
    /**
     * Count the number of natural regions.
     * @returns The number of natural regions.
     */
    count(): Promise<number>;
    /**
     * Update a natural region.
     * @param naturalRegion - The natural region to update.
     * @returns The updated natural region.
     */
    update(naturalRegion: NaturalRegion): Promise<NaturalRegion>;
    /**
     * Soft-delete a natural region by its id (sets deleted_at).
     * @param id - The id of the natural region to soft-delete.
     */
    softDelete(id: number): Promise<void>;
}
