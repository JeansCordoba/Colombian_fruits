import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { ORM_ENTITIES } from './orm-entities';

config();

const DEFAULT_DATABASE_PORT = 5432;

/**
 * Standalone TypeORM data source for migrations CLI and production startup.
 */
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? DEFAULT_DATABASE_PORT),
    username: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    database: process.env.DATABASE_NAME ?? 'colombian_fruits',
    entities: [...ORM_ENTITIES],
    migrations: [`${__dirname}/migrations/*.{ts,js}`],
    synchronize: false,
});
