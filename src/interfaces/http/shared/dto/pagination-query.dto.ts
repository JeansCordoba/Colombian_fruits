import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../../../../application/shared/constants/pagination.constants';

export class PaginationQueryDto {
    @ApiPropertyOptional({ example: DEFAULT_PAGE, minimum: 1, default: DEFAULT_PAGE })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ example: DEFAULT_LIMIT, minimum: 1, maximum: MAX_LIMIT, default: DEFAULT_LIMIT })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(MAX_LIMIT)
    limit?: number;
}
