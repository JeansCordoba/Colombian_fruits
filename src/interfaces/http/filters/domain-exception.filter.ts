import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
    DepartmentNotFoundException,
    DuplicateDepartmentCodeException,
    InvalidDepartmentDataException,
} from '../../../domain/departments/exceptions/department.exceptions';

type DomainException =
    | DepartmentNotFoundException
    | DuplicateDepartmentCodeException
    | InvalidDepartmentDataException;

/**
 * Maps domain exceptions to HTTP responses.
 */
@Catch(
    DepartmentNotFoundException,
    DuplicateDepartmentCodeException,
    InvalidDepartmentDataException,
)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        const status = this.resolveStatus(exception);
        response.status(status).json({
            statusCode: status,
            message: exception.message,
            error: this.resolveErrorLabel(status),
        });
    }

    private resolveStatus(exception: DomainException): number {
        if (exception instanceof DepartmentNotFoundException) {
            return HttpStatus.NOT_FOUND;
        }
        if (exception instanceof DuplicateDepartmentCodeException) {
            return HttpStatus.CONFLICT;
        }
        return HttpStatus.UNPROCESSABLE_ENTITY;
    }

    private resolveErrorLabel(status: number): string {
        const labels: Record<number, string> = {
            [HttpStatus.NOT_FOUND]: 'Not Found',
            [HttpStatus.CONFLICT]: 'Conflict',
            [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
        };
        return labels[status] ?? 'Error';
    }
}
