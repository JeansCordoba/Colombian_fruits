import { ApiProperty } from '@nestjs/swagger';
import { NaturalRegionResponseDto } from './natural-region.response.dto';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';

export class NaturalRegionListResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [NaturalRegionResponseDto] })
    data: NaturalRegionResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
