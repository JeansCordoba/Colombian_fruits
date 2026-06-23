/**
 * Command for the create department use case.
 * @param name - The name of the department.
 * @param code - The code of the department.
 */

export class CreateDepartmentCommand {
    constructor(
        readonly name: string,
        readonly code: string,
    ) {}
}