export class UpdateFruitCommand {
    constructor(
        readonly id: number,
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
