import { Fruit } from "../entities/fruit.entity";

/**
 * Relations between a fruit and other entities.
 */
export interface FruitRelations{
    climateIds: number[];
    departmentIds: number[];
    naturalRegionIds: number[];
    harvestSeasonIds: number[];
}

/**
 * Repository port for the fruit entity.
 */
export interface FruitRepositoryPort{
    /**
     * Save a fruit with its relations.
     * @param fruit - The fruit to save.
     * @param relations - The relations to save.
     * @returns The saved fruit.
     */
    save(fruit: Fruit, relations: FruitRelations): Promise<Fruit>;
    /**
     * Find a fruit by its id.
     * @param id - The id of the fruit to find.
     * @returns The found fruit or throws a FruitNotFoundException if not found.
     */
    findById(id: number): Promise<Fruit | null>;
    /**
     * Find a fruit by its scientific name.
     * @param scientificName - The scientific name of the fruit to find.
     * @returns The found fruit or null if not found.
     */
    findByScientificName(scientificName: string): Promise<Fruit | null>;
    /**
     * Find all fruits.
     * @returns All fruits.
     */
    findAll(): Promise<Fruit[]>;
    /**
     * Update a fruit.
     * @param fruit - The fruit to update.
     * @returns The updated fruit.
     */
    update(fruit: Fruit): Promise<Fruit>;
}