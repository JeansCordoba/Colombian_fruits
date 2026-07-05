import { ApiProperty } from '@nestjs/swagger';
import { FamilyWithTypePlant } from '../../../../domain/families/entities/family-with-type-plant';

export class TypePlantNestedResponseDto {
    @ApiProperty({ example: 3 })
    id: number;

    @ApiProperty({ example: 'Vine' })
    name: string;
}

export class FamilyResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Passifloraceae' })
    name: string;

    @ApiProperty({ type: TypePlantNestedResponseDto })
    typePlant: TypePlantNestedResponseDto;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    updatedAt: string;

    static fromDomain(familyWithTypePlant: FamilyWithTypePlant): FamilyResponseDto {
        const response = new FamilyResponseDto();
        response.id = familyWithTypePlant.family.id;
        response.name = familyWithTypePlant.family.name;
        response.typePlant = {
            id: familyWithTypePlant.family.typePlantId,
            name: familyWithTypePlant.typePlantName,
        };
        response.createdAt = familyWithTypePlant.family.createdAt.toISOString();
        response.updatedAt = familyWithTypePlant.family.updatedAt.toISOString();
        return response;
    }
}

export class FamilyDataResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: FamilyResponseDto })
    data: FamilyResponseDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
