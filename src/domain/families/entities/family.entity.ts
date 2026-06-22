export class Family {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly typePlantId: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}
}