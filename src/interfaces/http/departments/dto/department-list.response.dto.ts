import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponseDto } from './department.response.dto';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';

export class DepartmentListResponseDto {
    @ApiProperty({ type: [DepartmentResponseDto] })
    data: DepartmentResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;
}
