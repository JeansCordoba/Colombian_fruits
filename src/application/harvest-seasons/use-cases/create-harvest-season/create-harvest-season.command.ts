export class CreateHarvestSeasonCommand {
    constructor(
        readonly startMonth: number,
        readonly endMonth: number,
    ) {}
}
