import { ApiProperty } from '@nestjs/swagger';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';

export class HarvestSeasonResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1, minimum: 1, maximum: 12 })
    startMonth: number;

    @ApiProperty({ example: 3, minimum: 1, maximum: 12 })
    endMonth: number;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    updatedAt: string;

    static fromDomain(harvestSeason: HarvestSeason): HarvestSeasonResponseDto {
        const response = new HarvestSeasonResponseDto();
        response.id = harvestSeason.id;
        response.startMonth = harvestSeason.startMonth;
        response.endMonth = harvestSeason.endMonth;
        response.createdAt = harvestSeason.createdAt.toISOString();
        response.updatedAt = harvestSeason.updatedAt.toISOString();
        return response;
    }
}

export class HarvestSeasonDataResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: HarvestSeasonResponseDto })
    data: HarvestSeasonResponseDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
