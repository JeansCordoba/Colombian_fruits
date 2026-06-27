import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDepartmentRequestDto {
    @ApiProperty({ example: 'Antioquia', maxLength: 50 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @ApiProperty({
        example: 'ANT',
        description: 'Uppercase abbreviation for the department',
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({ value }: { value: string }) => value.toUpperCase())
    code: string;
}
