import { DomainException, DomainExceptionKind } from '../../shared/exceptions/domain-exception.base';

/**
 * Thrown when a family is not found by id.
 */
export class FamilyNotFoundException extends DomainException {
    readonly kind = DomainExceptionKind.NOT_FOUND;

    constructor(readonly familyId: number) {
        super(`Family with id ${familyId} not found.`);
        this.name = 'FamilyNotFoundException';
    }
}

/**
 * Thrown when a family with the same name already exists.
 */
export class DuplicateFamilyNameException extends DomainException {
    readonly kind = DomainExceptionKind.CONFLICT;

    constructor(readonly familyName: string) {
        super(`Family with name ${familyName} already exists.`);
        this.name = 'DuplicateFamilyNameException';
    }
}

/**
 * Thrown when family data is invalid.
 */
export class InvalidFamilyDataException extends DomainException {
    readonly kind = DomainExceptionKind.INVALID_DATA;

    constructor(readonly reason: string) {
        super(`Invalid family data: ${reason}.`);
        this.name = 'InvalidFamilyDataException';
    }
}
