import { DomainException, DomainExceptionKind } from '../../shared/exceptions/domain-exception.base';

/**
 * Thrown when a natural region is not found by id.
 */
export class NaturalRegionNotFoundException extends DomainException {
    readonly kind = DomainExceptionKind.NOT_FOUND;

    constructor(readonly naturalRegionId: number) {
        super(`Natural region with id ${naturalRegionId} not found.`);
        this.name = 'NaturalRegionNotFoundException';
    }
}

/**
 * Thrown when natural region data is invalid.
 */
export class InvalidNaturalRegionDataException extends DomainException {
    readonly kind = DomainExceptionKind.INVALID_DATA;

    constructor(readonly reason: string) {
        super(`Invalid natural region data: ${reason}.`);
        this.name = 'InvalidNaturalRegionDataException';
    }
}
