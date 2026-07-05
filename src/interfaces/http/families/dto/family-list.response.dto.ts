import { ApiProperty } from '@nestjs/swagger';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';
import { FamilyResponseDto } from './family.response.dto';

export class FamilyListResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [FamilyResponseDto] })
    data: FamilyResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
