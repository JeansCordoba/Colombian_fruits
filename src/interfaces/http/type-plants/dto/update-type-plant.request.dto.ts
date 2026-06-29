import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateTypePlantRequestDto {
    @ApiProperty({ example: 'Arbol', maxLength: 50 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;
}
