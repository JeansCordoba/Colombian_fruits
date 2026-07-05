import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateFamilyRequestDto {
    @ApiProperty({ example: 'Passifloraceae', maxLength: 50 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @ApiProperty({ example: 3, description: 'Type plant numeric identifier' })
    @IsInt()
    @Min(1)
    typePlantId: number;
}
