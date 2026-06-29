import { InvalidHarvestSeasonDataException } from '../../../domain/harvest-seasons/exceptions/harvest-season.exceptions';
import { MAX_HARVEST_MONTH, MIN_HARVEST_MONTH } from '../constants/harvest-season.constants';

export function assertValidHarvestSeasonMonths(startMonth: number, endMonth: number): void {
    if (startMonth < MIN_HARVEST_MONTH || startMonth > MAX_HARVEST_MONTH) {
        throw new InvalidHarvestSeasonDataException(
            `startMonth must be between ${MIN_HARVEST_MONTH} and ${MAX_HARVEST_MONTH}`,
        );
    }
    if (endMonth < MIN_HARVEST_MONTH || endMonth > MAX_HARVEST_MONTH) {
        throw new InvalidHarvestSeasonDataException(
            `endMonth must be between ${MIN_HARVEST_MONTH} and ${MAX_HARVEST_MONTH}`,
        );
    }
}
