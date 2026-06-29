import { HarvestSeason } from '../entities/harvest-season.entity';

/**
 * Repository port for the harvest season entity.
 */
export interface HarvestSeasonRepositoryPort {
    /**
     * Save a harvest season.
     * @param harvestSeason - The harvest season to save.
     * @returns The saved harvest season.
     */
    save(harvestSeason: HarvestSeason): Promise<HarvestSeason>;
    /**
     * Find a harvest season by its id.
     * @param id - The id of the harvest season to find.
     * @returns The found harvest season or null if not found.
     */
    findById(id: number): Promise<HarvestSeason | null>;
    /**
     * Find all harvest seasons.
     * @returns All harvest seasons.
     */
    findAll(): Promise<HarvestSeason[]>;
    /**
     * Find paginated harvest seasons.
     * @param page - The page number.
     * @param limit - The number of harvest seasons per page.
     * @returns The paginated harvest seasons.
     */
    findPaginated(page: number, limit: number): Promise<HarvestSeason[]>;
    /**
     * Count the number of harvest seasons.
     * @returns The number of harvest seasons.
     */
    count(): Promise<number>;
    /**
     * Update a harvest season.
     * @param harvestSeason - The harvest season to update.
     * @returns The updated harvest season.
     */
    update(harvestSeason: HarvestSeason): Promise<HarvestSeason>;
    /**
     * Soft-delete a harvest season by its id (sets deleted_at).
     * @param id - The id of the harvest season to soft-delete.
     */
    softDelete(id: number): Promise<void>;
}
