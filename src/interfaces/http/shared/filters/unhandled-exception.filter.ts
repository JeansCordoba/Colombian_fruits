import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { buildApiErrorResponse } from '../http/build-api-error-response';

/**
 * Maps unhandled exceptions to HTTP responses.
 */
@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        const status = this.resolveStatus(exception);
        const message = this.resolveMessage(exception);
        response.status(status).json(buildApiErrorResponse(status, message));
    }

    private resolveStatus(exception: unknown): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private resolveMessage(exception: unknown): string | string[] {
        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                return exceptionResponse;
            }
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
                const message = (exceptionResponse as { message: string | string[] }).message;
                return Array.isArray(message) ? message : message;
            }
        }
        if (exception instanceof Error) {
            return exception.message;
        }
        return 'Internal server error';
    }
}
