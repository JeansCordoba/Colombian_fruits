import { ApiProperty } from '@nestjs/swagger';

export class FamilyTypePlantResponseDto {
    @ApiProperty({ example: 3 })
    id: number;

    @ApiProperty({ example: 'Vine' })
    name: string;
}
