import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../constants/pagination.constants';
import { PaginatedMeta } from '../types/paginated-result';

export interface NormalizedPagination {
    page: number;
    limit: number;
}

export function normalizePagination(page: number, limit: number): NormalizedPagination {
    const normalizedPage = page > 0 ? page : DEFAULT_PAGE;
    const normalizedLimit = limit > 0 ? Math.min(limit, MAX_LIMIT) : DEFAULT_LIMIT;
    return { page: normalizedPage, limit: normalizedLimit };
}

export function buildPaginatedMeta(total: number, page: number, limit: number): PaginatedMeta {
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    return { total, page, limit, totalPages };
}
