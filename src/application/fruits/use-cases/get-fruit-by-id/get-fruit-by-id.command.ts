/**
 * Command for the GetFruitByIdUseCase.
 */
export class GetFruitByIdCommand {
    /**
     * @param id - The id of the fruit to get.
     */
    constructor(readonly id: number) {}
}