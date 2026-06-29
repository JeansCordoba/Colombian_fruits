export class UpdateHarvestSeasonCommand {
    constructor(
        readonly id: number,
        readonly startMonth: number,
        readonly endMonth: number,
    ) {}
}
