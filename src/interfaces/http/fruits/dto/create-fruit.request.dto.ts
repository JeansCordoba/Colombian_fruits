import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayUnique,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateFruitRequestDto {
    @ApiProperty({ example: 'Granadilla', maxLength: 50 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    commonName: string;

    @ApiProperty({ example: 'Passiflora ligularis', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    scientificName: string;

    @ApiPropertyOptional({ example: 'Fruta de la familia Passifloraceae' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    familyId: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    typeFruitId: number;

    @ApiProperty({ example: [1], type: [Number] })
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @Min(1, { each: true })
    @Type(() => Number)
    climateIds: number[];

    @ApiProperty({ example: [5, 11], type: [Number] })
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @Min(1, { each: true })
    @Type(() => Number)
    departmentIds: number[];

    @ApiProperty({ example: [2], type: [Number] })
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @Min(1, { each: true })
    @Type(() => Number)
    naturalRegionIds: number[];

    @ApiProperty({ example: [3], type: [Number] })
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @Min(1, { each: true })
    @Type(() => Number)
    harvestSeasonIds: number[];
}
