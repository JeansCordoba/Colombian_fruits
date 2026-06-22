/**
 * Thrown when a type fruit is not found by id.
 */
export class TypeFruitNotFoundException extends Error {
    constructor(readonly typeFruitId: number) {
        super(`Type fruit with id ${typeFruitId} not found.`);
        this.name = 'TypeFruitNotFoundException';
    }
}
/**
 * Thrown when a type fruit with the same name already exists.
 */
export class DuplicateTypeFruitNameException extends Error {
    constructor(readonly name: string) {
        super(`Type fruit with name ${name} already exists.`);
        this.name = 'DuplicateTypeFruitNameException';
    }
}
/**
 * Thrown when type fruit data breaks a domain rule.
 */
export class InvalidTypeFruitDataException extends Error {
    constructor(reason: string) {
        super(`Invalid type fruit data: ${reason}.`);
        this.name = 'InvalidTypeFruitDataException';
    }
}