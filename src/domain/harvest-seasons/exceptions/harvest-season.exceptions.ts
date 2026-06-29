import { DomainException, DomainExceptionKind } from '../../shared/exceptions/domain-exception.base';

/**
 * Thrown when a harvest season is not found by id.
 */
export class HarvestSeasonNotFoundException extends DomainException {
    readonly kind = DomainExceptionKind.NOT_FOUND;

    constructor(readonly harvestSeasonId: number) {
        super(`Harvest season with id ${harvestSeasonId} not found.`);
        this.name = 'HarvestSeasonNotFoundException';
    }
}

/**
 * Thrown when harvest season data is invalid.
 */
export class InvalidHarvestSeasonDataException extends DomainException {
    readonly kind = DomainExceptionKind.INVALID_DATA;

    constructor(readonly reason: string) {
        super(`Invalid harvest season data: ${reason}.`);
        this.name = 'InvalidHarvestSeasonDataException';
    }
}
