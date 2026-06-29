export class UpdateTypeFruitCommand {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly description: string | null | undefined,
    ) {}
}
