export class CreateTypeFruitCommand {
    constructor(
        readonly name: string,
        readonly description: string | null,
    ) {}
}