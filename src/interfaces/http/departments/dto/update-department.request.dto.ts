import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDepartmentRequestDto {
    @ApiProperty({ example: 'Antioquia', maxLength: 25 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(25)
    name: string;

    @ApiProperty({
        example: 'ANT',
        description: 'Uppercase abbreviation for the department',
        maxLength: 4,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(4)
    @Transform(({ value }: { value: string }) => value.toUpperCase())
    code: string;
}
