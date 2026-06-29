import { DomainException, DomainExceptionKind } from '../../shared/exceptions/domain-exception.base';

/**
 * Thrown when a department is not found by id.
 */
export class DepartmentNotFoundException extends DomainException {
    readonly kind = DomainExceptionKind.NOT_FOUND;

    constructor(readonly departmentId: number) {
        super(`Department with id ${departmentId} not found.`);
        this.name = 'DepartmentNotFoundException';
    }
}

/**
 * Thrown when a department with the same code already exists.
 */
export class DuplicateDepartmentCodeException extends DomainException {
    readonly kind = DomainExceptionKind.CONFLICT;

    constructor(readonly code: string) {
        super(`Department with code ${code} already exists.`);
        this.name = 'DuplicateDepartmentCodeException';
    }
}

/**
 * Thrown when department data is invalid.
 */
export class InvalidDepartmentDataException extends DomainException {
    readonly kind = DomainExceptionKind.INVALID_DATA;

    constructor(readonly reason: string) {
        super(`Invalid department data: ${reason}.`);
        this.name = 'InvalidDepartmentDataException';
    }
}
