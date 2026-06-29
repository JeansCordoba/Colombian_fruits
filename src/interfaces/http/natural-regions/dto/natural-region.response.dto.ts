import { ApiProperty } from '@nestjs/swagger';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';

export class NaturalRegionResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Andean Region' })
    name: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    updatedAt: string;

    static fromDomain(naturalRegion: NaturalRegion): NaturalRegionResponseDto {
        const response = new NaturalRegionResponseDto();
        response.id = naturalRegion.id;
        response.name = naturalRegion.name;
        response.createdAt = naturalRegion.createdAt.toISOString();
        response.updatedAt = naturalRegion.updatedAt.toISOString();
        return response;
    }
}
