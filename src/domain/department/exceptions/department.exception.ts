/**
 * Thrown when a department is not found by id.
 * @param departmentId - The id of the department that is not found.
 * @returns The department not found exception.
 */
export class DepartmentNotFoundException extends Error {
    constructor(readonly departmentId: number) {
        super(`Department with id ${departmentId} not found.`);
        this.name = 'DepartmentNotFoundException';
    }
}
/**
 * Thrown when a department with the same name already exists.
 * @param name - The name of the department that already exists.
 * @returns The department name already exists exception.
 */
export class DuplicateDepartmentNameException extends Error {
    constructor(readonly name: string) {
        super(`Department with name ${name} already exists.`);
        this.name = 'DuplicateDepartmentNameException';
    }
}
/**
 * Thrown when a department with the same code already exists.
 * @param code - The code of the department that already exists.
 * @returns The department code already exists exception.
 */
export class DuplicateDepartmentCodeException extends Error {
    constructor(readonly code: string) {
        super(`Department with code ${code} already exists.`);
        this.name = 'DuplicateDepartmentCodeException';
    }
}
/**
 * Thrown when a department data is invalid.
 * @param reason - The reason the department data is invalid.
 * @returns The invalid department data exception.
 */
export class InvalidDepartmentDataException extends Error {
    constructor(readonly reason: string) {
        super(`Invalid department data: ${reason}.`);
        this.name = 'InvalidDepartmentDataException';
    }
}