import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException, DomainExceptionKind } from '../../../../domain/shared/exceptions/domain-exception.base';
import { buildApiErrorResponse } from '../http/build-api-error-response';

/**
 * Maps domain exceptions to HTTP responses.
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        const status = this.resolveStatus(exception.kind);
        response.status(status).json(buildApiErrorResponse(status, exception.message));
    }

    private resolveStatus(kind: DomainExceptionKind): number {
        const statusByKind: Record<DomainExceptionKind, number> = {
            [DomainExceptionKind.NOT_FOUND]: HttpStatus.NOT_FOUND,
            [DomainExceptionKind.CONFLICT]: HttpStatus.CONFLICT,
            [DomainExceptionKind.INVALID_DATA]: HttpStatus.UNPROCESSABLE_ENTITY,
        };
        return statusByKind[kind];
    }
}
