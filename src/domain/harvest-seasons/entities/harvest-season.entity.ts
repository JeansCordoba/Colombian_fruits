export class HarvestSeason {
    constructor(
        public readonly id: number,
        public readonly startMonth: number,
        public readonly endMonth: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}
