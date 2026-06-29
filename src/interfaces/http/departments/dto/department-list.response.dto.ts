import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponseDto } from './department.response.dto';
import { PaginatedListMetaDto } from '../../shared/dto/paginated-list-meta.dto';

export class DepartmentListResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [DepartmentResponseDto] })
    data: DepartmentResponseDto[];

    @ApiProperty({ type: PaginatedListMetaDto })
    meta: PaginatedListMetaDto;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
