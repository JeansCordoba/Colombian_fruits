export class Fruit {
    constructor(
        readonly id: number,
        readonly commonName: string,
        readonly scientificName: string,
        readonly description: string | null,
        readonly familyId: number,
        readonly typeFruitId: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}
}