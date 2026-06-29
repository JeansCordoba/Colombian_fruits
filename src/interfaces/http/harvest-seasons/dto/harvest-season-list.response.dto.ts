import { ApiProperty } from '@nestjs/swagger';
import { HarvestSeasonResponseDto } from './harvest-season.response.dto';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';

export class HarvestSeasonListResponseDto {
    @ApiProperty({ type: [HarvestSeasonResponseDto] })
    data: HarvestSeasonResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;
}
