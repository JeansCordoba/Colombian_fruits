import { ApiProperty } from '@nestjs/swagger';
import {
    CatalogItemReadModel,
    FruitListItem,
    FruitWithRelations,
    HarvestSeasonReadModel,
} from '../../../../domain/fruits/read-models/fruit-with-relations.read-model';

export class CatalogItemResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Tropical' })
    name: string;

    static fromReadModel(item: CatalogItemReadModel): CatalogItemResponseDto {
        const response = new CatalogItemResponseDto();
        response.id = item.id;
        response.name = item.name;
        return response;
    }
}

export class HarvestSeasonResponseDto {
    @ApiProperty({ example: 3 })
    id: number;

    @ApiProperty({ example: 1, minimum: 1, maximum: 12 })
    startMonth: number;

    @ApiProperty({ example: 12, minimum: 1, maximum: 12 })
    endMonth: number;

    static fromReadModel(season: HarvestSeasonReadModel): HarvestSeasonResponseDto {
        const response = new HarvestSeasonResponseDto();
        response.id = season.id;
        response.startMonth = season.startMonth;
        response.endMonth = season.endMonth;
        return response;
    }
}

export class FamilyWithTypePlantResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Passifloraceae' })
    name: string;

    @ApiProperty({ type: CatalogItemResponseDto })
    typePlant: CatalogItemResponseDto;
}

export class FruitResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Granadilla' })
    commonName: string;

    @ApiProperty({ example: 'Passiflora ligularis' })
    scientificName: string;

    @ApiProperty({ example: 'Fruta de la familia Passifloraceae', nullable: true })
    description: string | null;

    @ApiProperty({ type: FamilyWithTypePlantResponseDto })
    family: FamilyWithTypePlantResponseDto;

    @ApiProperty({ type: CatalogItemResponseDto })
    typeFruit: CatalogItemResponseDto;

    @ApiProperty({ type: [CatalogItemResponseDto] })
    climates: CatalogItemResponseDto[];

    @ApiProperty({ type: [CatalogItemResponseDto] })
    departments: CatalogItemResponseDto[];

    @ApiProperty({ type: [CatalogItemResponseDto] })
    naturalRegions: CatalogItemResponseDto[];

    @ApiProperty({ type: [HarvestSeasonResponseDto] })
    harvestSeasons: HarvestSeasonResponseDto[];

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    updatedAt: string;

    static fromReadModel(fruit: FruitWithRelations): FruitResponseDto {
        const response = new FruitResponseDto();
        response.id = fruit.id;
        response.commonName = fruit.commonName;
        response.scientificName = fruit.scientificName;
        response.description = fruit.description;
        response.family = {
            id: fruit.family.id,
            name: fruit.family.name,
            typePlant: CatalogItemResponseDto.fromReadModel(fruit.family.typePlant),
        };
        response.typeFruit = CatalogItemResponseDto.fromReadModel(fruit.typeFruit);
        response.climates = fruit.climates.map((item) => CatalogItemResponseDto.fromReadModel(item));
        response.departments = fruit.departments.map((item) => CatalogItemResponseDto.fromReadModel(item));
        response.naturalRegions = fruit.naturalRegions.map((item) => CatalogItemResponseDto.fromReadModel(item));
        response.harvestSeasons = fruit.harvestSeasons.map((item) => HarvestSeasonResponseDto.fromReadModel(item));
        response.createdAt = fruit.createdAt.toISOString();
        response.updatedAt = fruit.updatedAt.toISOString();
        return response;
    }
}

export class FruitSummaryResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Granadilla' })
    commonName: string;

    @ApiProperty({ example: 'Passiflora ligularis' })
    scientificName: string;

    @ApiProperty({ type: CatalogItemResponseDto })
    family: CatalogItemResponseDto;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    createdAt: string;

    static fromListItem(item: FruitListItem): FruitSummaryResponseDto {
        const response = new FruitSummaryResponseDto();
        response.id = item.id;
        response.commonName = item.commonName;
        response.scientificName = item.scientificName;
        response.family = CatalogItemResponseDto.fromReadModel(item.family);
        response.createdAt = item.createdAt.toISOString();
        return response;
    }
}

export class FruitDataResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: FruitResponseDto })
    data: FruitResponseDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
