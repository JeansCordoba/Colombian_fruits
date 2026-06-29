import { ApiProperty } from '@nestjs/swagger';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';

export class TypePlantResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Arbusto' })
    name: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    updatedAt: string;

    static fromDomain(typePlant: TypePlant): TypePlantResponseDto {
        const response = new TypePlantResponseDto();
        response.id = typePlant.id;
        response.name = typePlant.name;
        response.createdAt = typePlant.createdAt.toISOString();
        response.updatedAt = typePlant.updatedAt.toISOString();
        return response;
    }
}

export class TypePlantDataResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: TypePlantResponseDto })
    data: TypePlantResponseDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
