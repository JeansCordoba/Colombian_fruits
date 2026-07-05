import { Family } from './family.entity';

/**
 * Read model pairing a family with the name of its related type plant.
 */
export interface FamilyWithTypePlant {
    readonly family: Family;
    readonly typePlantName: string;
}
