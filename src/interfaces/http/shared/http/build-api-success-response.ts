import { PaginatedListMetaDto } from '../dto/paginated-list-meta.dto';

export interface ApiSuccessResponseBody<T> {
    success: true;
    data: T;
    statusCode: number;
}

export interface ApiPaginatedSuccessResponseBody<T> {
    success: true;
    data: T[];
    meta: PaginatedListMetaDto;
    statusCode: number;
}

/**
 * Builds the standard single-item API success response body.
 */
export function buildApiSuccessResponse<T>(data: T, statusCode: number): ApiSuccessResponseBody<T> {
    return { success: true, data, statusCode };
}

/**
 * Builds the standard paginated API success response body.
 */
export function buildApiPaginatedSuccessResponse<T>(
    data: T[],
    meta: PaginatedListMetaDto,
    statusCode: number,
): ApiPaginatedSuccessResponseBody<T> {
    return { success: true, data, meta, statusCode };
}
