import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { MAX_HARVEST_MONTH, MIN_HARVEST_MONTH } from '../../../../application/harvest-seasons/constants/harvest-season.constants';

export class UpdateHarvestSeasonRequestDto {
    @ApiProperty({ example: 4, minimum: MIN_HARVEST_MONTH, maximum: MAX_HARVEST_MONTH })
    @Type(() => Number)
    @IsInt()
    @Min(MIN_HARVEST_MONTH)
    @Max(MAX_HARVEST_MONTH)
    startMonth: number;

    @ApiProperty({ example: 6, minimum: MIN_HARVEST_MONTH, maximum: MAX_HARVEST_MONTH })
    @Type(() => Number)
    @IsInt()
    @Min(MIN_HARVEST_MONTH)
    @Max(MAX_HARVEST_MONTH)
    endMonth: number;
}
