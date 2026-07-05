/**
 * Catalog item projection used inside the fruit read model (id + name).
 */
export interface CatalogItemReadModel {
    id: number;
    name: string;
}

/**
 * Harvest season projection used inside the fruit read model.
 */
export interface HarvestSeasonReadModel {
    id: number;
    startMonth: number;
    endMonth: number;
}

/**
 * Family projection with its type plant, used inside the fruit read model.
 */
export interface FamilyWithTypePlantReadModel {
    id: number;
    name: string;
    typePlant: CatalogItemReadModel;
}

/**
 * Summary read model for paginated fruit lists.
 */
export interface FruitListItem {
    id: number;
    commonName: string;
    scientificName: string;
    family: CatalogItemReadModel;
    createdAt: Date;
}

/**
 * Read model for a fruit aggregate with all its relations resolved.
 */
export interface FruitWithRelations {
    id: number;
    commonName: string;
    scientificName: string;
    description: string | null;
    family: FamilyWithTypePlantReadModel;
    typeFruit: CatalogItemReadModel;
    climates: CatalogItemReadModel[];
    departments: CatalogItemReadModel[];
    naturalRegions: CatalogItemReadModel[];
    harvestSeasons: HarvestSeasonReadModel[];
    createdAt: Date;
    updatedAt: Date;
}
