export class UpdateDepartmentCommand {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly code: string,
    ) {}
}
