import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTypePlantRequestDto {
    @ApiProperty({ example: 'Arbusto', maxLength: 50 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;
}
