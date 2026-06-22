/**
 * Thrown when a family is not found by id.
 */
export class FamilyNotFoundException extends Error {
    constructor(readonly familyId: number) {
        super(`Family with id ${familyId} not found.`);
        this.name = 'FamilyNotFoundException';
    }
}
/**
 * Thrown when a family with the same name already exists.
 */
export class DuplicateFamilyNameException extends Error {
    constructor(readonly name: string) {
        super(`Family with name ${name} already exists.`);
        this.name = 'DuplicateFamilyNameException';
    }
}
/**
 * Thrown when family data breaks a domain rule.
 */
export class InvalidFamilyDataException extends Error {
    constructor(reason: string) {
        super(`Invalid family data: ${reason}.`);
        this.name = 'InvalidFamilyDataException';
    }
}