import { ApiProperty } from '@nestjs/swagger';
import { ClimateResponseDto } from './climate.response.dto';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';

export class ClimateListResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [ClimateResponseDto] })
    data: ClimateResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
