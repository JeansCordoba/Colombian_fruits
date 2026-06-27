/**
 * Thrown when a department is not found by id.
 */
export class DepartmentNotFoundException extends Error {
    constructor(readonly departmentId: number) {
        super(`Department with id ${departmentId} not found.`);
        this.name = 'DepartmentNotFoundException';
    }
}

/**
 * Thrown when a department with the same code already exists.
 */
export class DuplicateDepartmentCodeException extends Error {
    constructor(readonly code: string) {
        super(`Department with code ${code} already exists.`);
        this.name = 'DuplicateDepartmentCodeException';
    }
}

/**
 * Thrown when department data is invalid.
 */
export class InvalidDepartmentDataException extends Error {
    constructor(readonly reason: string) {
        super(`Invalid department data: ${reason}.`);
        this.name = 'InvalidDepartmentDataException';
    }
}
