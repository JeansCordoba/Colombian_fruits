/**
 * Thrown when a type plant is not found by id.
 */
export class TypePlantNotFoundException extends Error {
    constructor(readonly typePlantId: number) {
        super(`Type plant with id ${typePlantId} not found.`);
        this.name = 'TypePlantNotFoundException';
    }
}
/**
 * Thrown when type plant data breaks a domain rule.
 */
export class InvalidTypePlantDataException extends Error {
    constructor(reason: string) {
        super(`Invalid type plant data: ${reason}.`);
        this.name = 'InvalidTypePlantDataException';
    }
}