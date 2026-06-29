import { ApiProperty } from '@nestjs/swagger';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';
import { TypePlantResponseDto } from './type-plant.response.dto';

export class TypePlantListResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [TypePlantResponseDto] })
    data: TypePlantResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
