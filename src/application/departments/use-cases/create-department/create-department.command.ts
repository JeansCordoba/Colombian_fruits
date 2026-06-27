export class CreateDepartmentCommand {
    constructor(
        readonly name: string,
        readonly code: string,
    ) {}
}
