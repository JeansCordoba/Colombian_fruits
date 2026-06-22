import { TypeFruit } from "../entities/type-fruit.entity";

/**
 * Repository port for the type fruit entity.
 */
export interface TypeFruitRepositoryPort{
    /**
     * Save a type fruit.
     * @param typeFruit - The type fruit to save.
     * @returns The saved type fruit.
     */
    save(typeFruit: TypeFruit): Promise<TypeFruit>;
    /**
     * Find a type fruit by its id.
     * @param id - The id of the type fruit to find.
     * @returns The found type fruit or null if not found.
     */
    findById(id: number): Promise<TypeFruit | null>;
    /**
     * Find all type fruits.
     * @returns All type fruits.
     */
    findAll(): Promise<TypeFruit[]>;
    /**
     * Update a type fruit.
     * @param typeFruit - The type fruit to update.
     * @returns The updated type fruit.
     */
    update(typeFruit: TypeFruit): Promise<TypeFruit>;
}

