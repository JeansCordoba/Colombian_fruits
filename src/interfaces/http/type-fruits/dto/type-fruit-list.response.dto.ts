import { ApiProperty } from '@nestjs/swagger';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';
import { TypeFruitResponseDto } from './type-fruit.response.dto';

export class TypeFruitListResponseDto {
    @ApiProperty({ type: [TypeFruitResponseDto] })
    data: TypeFruitResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;
}
