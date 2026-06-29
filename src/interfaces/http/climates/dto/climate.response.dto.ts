import { ApiProperty } from '@nestjs/swagger';
import { Climate } from '../../../../domain/climates/entities/climate.entity';

export class ClimateResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Tropical' })
    name: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    updatedAt: string;

    static fromDomain(climate: Climate): ClimateResponseDto {
        const response = new ClimateResponseDto();
        response.id = climate.id;
        response.name = climate.name;
        response.createdAt = climate.createdAt.toISOString();
        response.updatedAt = climate.updatedAt.toISOString();
        return response;
    }
}
