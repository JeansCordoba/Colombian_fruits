import { ApiProperty } from '@nestjs/swagger';
import { NaturalRegionResponseDto } from './natural-region.response.dto';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';

export class NaturalRegionListResponseDto {
    @ApiProperty({ type: [NaturalRegionResponseDto] })
    data: NaturalRegionResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;
}
