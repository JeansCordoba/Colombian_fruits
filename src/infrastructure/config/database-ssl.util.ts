/**
 * Resolves PostgreSQL SSL options for managed providers such as Neon.
 */
export function resolveDatabaseSsl(): { rejectUnauthorized: boolean } | undefined {
    if (process.env.DATABASE_SSL === 'true') {
        return { rejectUnauthorized: false };
    }
    return undefined;
}
