/**
 * Command for the CreateFruitUseCase.
 */
export class CreateFruitCommand {
    /**
     * @param commonName - The common name of the fruit.
     * @param scientificName - The scientific name of the fruit.
     * @param description - The description of the fruit.
     * @param familyId - The id of the family of the fruit.
     * @param typeFruitId - The id of the type of the fruit.
     * @param climateIds - The ids of the climates of the fruit.
     * @param departmentIds - The ids of the departments of the fruit.
     * @param naturalRegionIds - The ids of the natural regions of the fruit.
     * @param harvestSeasonIds - The ids of the harvest seasons of the fruit.
     */
    constructor(
        readonly commonName: string,
        readonly scientificName: string,
        readonly description: string | null,
        readonly familyId: number,
        readonly typeFruitId: number,
        readonly climateIds: number[],
        readonly departmentIds: number[],
        readonly naturalRegionIds: number[],
        readonly harvestSeasonIds: number[],
    ) {}
}