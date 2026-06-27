import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponseDto } from './department.response.dto';

export class DepartmentListMetaDto {
    @ApiProperty({ example: 42 })
    total: number;

    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 20 })
    limit: number;

    @ApiProperty({ example: 3 })
    totalPages: number;
}

export class DepartmentListResponseDto {
    @ApiProperty({ type: [DepartmentResponseDto] })
    data: DepartmentResponseDto[];

    @ApiProperty({ type: DepartmentListMetaDto })
    meta: DepartmentListMetaDto;
}
