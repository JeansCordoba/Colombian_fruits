export class Department {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly code: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}