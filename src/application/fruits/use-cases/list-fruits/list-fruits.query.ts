export class ListFruitsQuery {
    constructor(
        readonly page: number,
        readonly limit: number,
        readonly search?: string,
    ) {}
}
