import { DomainException, DomainExceptionKind } from '../../shared/exceptions/domain-exception.base';

/**
 * Thrown when a type fruit is not found by id.
 */
export class TypeFruitNotFoundException extends DomainException {
    readonly kind = DomainExceptionKind.NOT_FOUND;

    constructor(readonly typeFruitId: number) {
        super(`Type fruit with id ${typeFruitId} not found.`);
        this.name = 'TypeFruitNotFoundException';
    }
}

/**
 * Thrown when type fruit data is invalid.
 */
export class InvalidTypeFruitDataException extends DomainException {
    readonly kind = DomainExceptionKind.INVALID_DATA;

    constructor(readonly reason: string) {
        super(`Invalid type fruit data: ${reason}.`);
        this.name = 'InvalidTypeFruitDataException';
    }
}
