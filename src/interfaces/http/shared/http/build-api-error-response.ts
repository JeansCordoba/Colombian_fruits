import { HttpStatus } from '@nestjs/common';
import { ApiErrorResponseDto } from '../dto/api-error.response.dto';

const ERROR_LABELS: Record<number, string> = {
    [HttpStatus.BAD_REQUEST]: 'Bad Request',
    [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
    [HttpStatus.FORBIDDEN]: 'Forbidden',
    [HttpStatus.NOT_FOUND]: 'Not Found',
    [HttpStatus.CONFLICT]: 'Conflict',
    [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};

/**
 * Builds the standard API error response body.
 */
export function buildApiErrorResponse(
    statusCode: number,
    message: string | string[],
): ApiErrorResponseDto {
    return {
        statusCode,
        message,
        error: ERROR_LABELS[statusCode] ?? 'Error',
    };
}
