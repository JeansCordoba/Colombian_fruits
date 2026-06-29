import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Maps unhandled exceptions to HTTP responses.
 */
@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        const status = this.resolveStatus(exception);
        const message = this.resolveMessage(exception);
        response.status(status).json({
            statusCode: status,
            message,
            error: this.resolveErrorLabel(status),
        });
    }

    private resolveStatus(exception: unknown): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private resolveMessage(exception: unknown): string {
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            if (typeof response === 'string') {
                return response;
            }
            if (typeof response === 'object' && response !== null && 'message' in response) {
                const message = (response as { message: string | string[] }).message;
                return Array.isArray(message) ? message.join(', ') : message;
            }
        }
        if (exception instanceof Error) {
            return exception.message;
        }
        return 'Internal server error';
    }

    private resolveErrorLabel(status: number): string {
        const labels: Record<number, string> = {
            [HttpStatus.BAD_REQUEST]: 'Bad Request',
            [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
            [HttpStatus.FORBIDDEN]: 'Forbidden',
            [HttpStatus.NOT_FOUND]: 'Not Found',
            [HttpStatus.CONFLICT]: 'Conflict',
            [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
            [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
        };
        return labels[status] ?? 'Error';
    }
}
