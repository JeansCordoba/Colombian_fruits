import { ApiProperty } from '@nestjs/swagger';
import { Department } from '../../../../domain/departments/entities/department.entity';

export class DepartmentResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Antioquia' })
    name: string;

    @ApiProperty({ example: 'ANT', description: 'Uppercase abbreviation' })
    code: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    updatedAt: string;

    static fromDomain(department: Department): DepartmentResponseDto {
        const response = new DepartmentResponseDto();
        response.id = department.id;
        response.name = department.name;
        response.code = department.code;
        response.createdAt = department.createdAt.toISOString();
        response.updatedAt = department.updatedAt.toISOString();
        return response;
    }
}
