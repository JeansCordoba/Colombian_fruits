import { ApiProperty } from '@nestjs/swagger';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';
import { FruitSummaryResponseDto } from './fruit.response.dto';

export class FruitListResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [FruitSummaryResponseDto] })
    data: FruitSummaryResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
