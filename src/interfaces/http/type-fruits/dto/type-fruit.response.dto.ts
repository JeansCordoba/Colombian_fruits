import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';

export class TypeFruitResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Citrus' })
    name: string;

    @ApiPropertyOptional({ example: 'Acidic fruits with high vitamin C content', nullable: true })
    description: string | null;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    updatedAt: string;

    static fromDomain(typeFruit: TypeFruit): TypeFruitResponseDto {
        const response = new TypeFruitResponseDto();
        response.id = typeFruit.id;
        response.name = typeFruit.name;
        response.description = typeFruit.description;
        response.createdAt = typeFruit.createdAt.toISOString();
        response.updatedAt = typeFruit.updatedAt.toISOString();
        return response;
    }
}
