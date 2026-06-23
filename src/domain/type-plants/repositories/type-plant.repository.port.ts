import { TypePlant } from "../entities/type-plant.entity";

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
     * Update a type plant.
     * @param typePlant - The type plant to update.
     * @returns The updated type plant.
     */
    update(typePlant: TypePlant): Promise<TypePlant>;
}