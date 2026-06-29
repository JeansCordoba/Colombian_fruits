import { ApiProperty } from '@nestjs/swagger';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';
import { TypeFruitResponseDto } from './type-fruit.response.dto';

export class TypeFruitListResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [TypeFruitResponseDto] })
    data: TypeFruitResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
