export class UpdateFamilyCommand {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly typePlantId: number,
    ) {}
}
