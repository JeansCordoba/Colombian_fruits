export class TypeFruit {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly description: string | null,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}
}