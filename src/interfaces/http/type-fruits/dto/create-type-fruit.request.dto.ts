import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTypeFruitRequestDto {
    @ApiProperty({ example: 'Citrus', maxLength: 50 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @ApiPropertyOptional({ example: 'Acidic fruits with high vitamin C content', nullable: true })
    @IsOptional()
    @IsString()
    description?: string | null;
}
