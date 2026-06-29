export enum DomainExceptionKind {
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    INVALID_DATA = 'INVALID_DATA',
}

/**
 * Base class for domain exceptions mapped to HTTP responses.
 */
export abstract class DomainException extends Error {
    abstract readonly kind: DomainExceptionKind;
}
