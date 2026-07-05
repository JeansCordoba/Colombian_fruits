import 'reflect-metadata';
import { AppDataSource } from './data-source';

/**
 * Runs pending TypeORM migrations. Used by Docker/production startup and `pnpm migration:run`.
 */
async function runMigrations(): Promise<void> {
    const dataSource = await AppDataSource.initialize();
    try {
        const executedMigrations = await dataSource.runMigrations();
        console.log(`Applied ${executedMigrations.length} migration(s).`);
    } finally {
        await dataSource.destroy();
    }
}

runMigrations().catch((error: unknown) => {
    console.error('Migration failed:', error);
    process.exit(1);
});
