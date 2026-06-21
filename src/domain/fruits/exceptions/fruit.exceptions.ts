/**
 * Thrown when a fruit is not found by id.
 */
export class FruitNotFoundException extends Error {
    constructor(readonly fruitId: number) {
        super(`Fruit with id ${fruitId} not found.`);
        this.name = 'FruitNotFoundException';
    }
}

/**
 * Thrown when a fruit is not found by scientific name.
 */
export class FruitScientificNameNotFoundException extends Error {
    constructor(readonly scientificName: string) {
        super(`Fruit with scientific name ${scientificName} not found.`);
        this.name = 'FruitScientificNameNotFoundException';
    }
}

/**
 * Thrown when a fruit with the same scientific name already exists.
 */
export class DuplicateFruitScientificNameException extends Error {
    constructor(readonly scientificName: string) {
        super(`Fruit with scientific name ${scientificName} already exists.`);
        this.name = 'DuplicateFruitScientificNameException';
    }
}

/**
 * Thrown when fruit data breaks a domain rule.
 */
export class InvalidFruitDataException extends Error {
    constructor(reason: string) {
        super(`Invalid fruit data: ${reason}.`);
        this.name = 'InvalidFruitDataException';
    }
}
