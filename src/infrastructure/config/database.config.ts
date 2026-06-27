import { registerAs } from '@nestjs/config';

const DEFAULT_DATABASE_PORT = 5432;

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  synchronize: boolean;
}

export const databaseConfig = registerAs(
  'database',
  (): DatabaseConfig => ({
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? DEFAULT_DATABASE_PORT),
    name: process.env.DATABASE_NAME ?? 'colombian_fruits',
    user: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  }),
);
