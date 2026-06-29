import { DomainException, DomainExceptionKind } from '../../shared/exceptions/domain-exception.base';

/**
 * Thrown when a type plant is not found by id.
 */
export class TypePlantNotFoundException extends DomainException {
    readonly kind = DomainExceptionKind.NOT_FOUND;

    constructor(readonly typePlantId: number) {
        super(`Type plant with id ${typePlantId} not found.`);
        this.name = 'TypePlantNotFoundException';
    }
}

/**
 * Thrown when type plant data is invalid.
 */
export class InvalidTypePlantDataException extends DomainException {
    readonly kind = DomainExceptionKind.INVALID_DATA;

    constructor(readonly reason: string) {
        super(`Invalid type plant data: ${reason}.`);
        this.name = 'InvalidTypePlantDataException';
    }
}
