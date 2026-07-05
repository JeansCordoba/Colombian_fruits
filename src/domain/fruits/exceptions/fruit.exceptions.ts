import { DomainException, DomainExceptionKind } from '../../shared/exceptions/domain-exception.base';

/**
 * Thrown when a fruit is not found by id.
 */
export class FruitNotFoundException extends DomainException {
    readonly kind = DomainExceptionKind.NOT_FOUND;

    constructor(readonly fruitId: number) {
        super(`Fruit with id ${fruitId} not found.`);
        this.name = 'FruitNotFoundException';
    }
}

/**
 * Thrown when a fruit with the same scientific name already exists.
 */
export class DuplicateFruitScientificNameException extends DomainException {
    readonly kind = DomainExceptionKind.CONFLICT;

    constructor(readonly scientificName: string) {
        super(`Fruit with scientific name ${scientificName} already exists.`);
        this.name = 'DuplicateFruitScientificNameException';
    }
}

/**
 * Thrown when fruit data breaks a domain rule.
 */
export class InvalidFruitDataException extends DomainException {
    readonly kind = DomainExceptionKind.INVALID_DATA;

    constructor(readonly reason: string) {
        super(`Invalid fruit data: ${reason}.`);
        this.name = 'InvalidFruitDataException';
    }
}
