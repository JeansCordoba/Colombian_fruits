export class CreateFamilyCommand {
    constructor(
        readonly name: string,
        readonly typePlantId: number,
    ) {}
}
