import { DomainException, DomainExceptionKind } from '../../shared/exceptions/domain-exception.base';

/**
 * Thrown when a climate is not found by id.
 */
export class ClimateNotFoundException extends DomainException {
    readonly kind = DomainExceptionKind.NOT_FOUND;

    constructor(readonly climateId: number) {
        super(`Climate with id ${climateId} not found.`);
        this.name = 'ClimateNotFoundException';
    }
}

/**
 * Thrown when climate data is invalid.
 */
export class InvalidClimateDataException extends DomainException {
    readonly kind = DomainExceptionKind.INVALID_DATA;

    constructor(readonly reason: string) {
        super(`Invalid climate data: ${reason}.`);
        this.name = 'InvalidClimateDataException';
    }
}
