import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
    @ApiProperty({ example: 'ok' })
    status: string;

    @ApiProperty({ example: 'connected' })
    database: string;

    @ApiProperty({ example: '2026-06-20T22:00:00.000Z' })
    timestamp: string;
}
