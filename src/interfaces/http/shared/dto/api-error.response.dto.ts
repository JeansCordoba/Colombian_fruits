import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard HTTP error response returned by global exception filters.
 */
export class ApiErrorResponseDto {
    @ApiProperty({ example: 404 })
    statusCode: number;

    @ApiProperty({
        oneOf: [
            { type: 'string', example: 'Department with id 99 not found.' },
            { type: 'array', items: { type: 'string' }, example: ['name must not be empty'] },
        ],
    })
    message: string | string[];

    @ApiProperty({ example: 'Not Found' })
    error: string;
}
