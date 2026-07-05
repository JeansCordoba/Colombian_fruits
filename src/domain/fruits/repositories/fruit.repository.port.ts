import { Fruit } from '../entities/fruit.entity';
import { FruitListItem, FruitWithRelations } from '../read-models/fruit-with-relations.read-model';

/**
 * Relations between a fruit and other entities that represent a N:M relationship.
 */
export interface FruitRelations {
    climateIds: number[];
    departmentIds: number[];
    naturalRegionIds: number[];
    harvestSeasonIds: number[];
}

/**
 * Repository port for the fruit aggregate.
 */
export interface FruitRepositoryPort {
    /**
     * Save a fruit with its N:M relations in a single transaction.
     * @param fruit - The fruit to save.
     * @param relations - The N:M relation ids to link.
     * @returns The saved fruit.
     */
    save(fruit: Fruit, relations: FruitRelations): Promise<Fruit>;
    /**
     * Find a fruit by its id.
     * @param id - The id of the fruit to find.
     * @returns The found fruit or null if not found.
     */
    findById(id: number): Promise<Fruit | null>;
    /**
     * Find a fruit by its id with family (+ type plant), type fruit and all N:M relations resolved.
     * @param id - The id of the fruit to find.
     * @returns The fruit read model with relations or null if not found.
     */
    findByIdWithRelations(id: number): Promise<FruitWithRelations | null>;
    /**
     * Find a fruit by its scientific name.
     * @param scientificName - The scientific name of the fruit to find.
     * @returns The found fruit or null if not found.
     */
    findByScientificName(scientificName: string): Promise<Fruit | null>;
    /**
     * Find paginated fruits, optionally filtered by a search term on common or scientific name.
     * @param page - The page number (1-based).
     * @param limit - The number of fruits per page.
     * @param search - Optional case-insensitive search on common name and scientific name.
     * @returns The paginated fruits.
     */
    findPaginated(page: number, limit: number, search?: string): Promise<FruitListItem[]>;
    /**
     * Count the number of fruits, optionally filtered by a search term.
     * @param search - Optional case-insensitive search on common name and scientific name.
     * @returns The number of fruits.
     */
    count(search?: string): Promise<number>;
    /**
     * Update a fruit and replace its N:M relations in a single transaction.
     * @param fruit - The fruit to update.
     * @param relations - The N:M relation ids that replace the existing ones.
     * @returns The updated fruit.
     */
    update(fruit: Fruit, relations: FruitRelations): Promise<Fruit>;
    /**
     * Soft-delete a fruit by its id (sets deleted_at).
     * @param id - The id of the fruit to soft-delete.
     */
    softDelete(id: number): Promise<void>;
}
