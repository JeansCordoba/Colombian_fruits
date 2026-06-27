import { plainToInstance, Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, validateSync } from 'class-validator';

const DEFAULT_PORT = 3000;
const DEFAULT_DATABASE_PORT = 5432;

/**
 * Validated environment variables loaded at application startup.
 */
export class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  NODE_ENV: string;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @Transform(({ value }: { value: unknown }) => value === 'true' || value === true)
  @IsBoolean()
  DATABASE_SYNCHRONIZE: boolean;
}

/**
 * Validates and transforms raw environment variables.
 */
export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const normalizedConfig: Record<string, unknown> = {
    PORT: config.PORT ?? DEFAULT_PORT,
    NODE_ENV: config.NODE_ENV ?? 'development',
    DATABASE_HOST: config.DATABASE_HOST ?? 'localhost',
    DATABASE_PORT: config.DATABASE_PORT ?? DEFAULT_DATABASE_PORT,
    DATABASE_NAME: config.DATABASE_NAME ?? 'colombian_fruits',
    DATABASE_USER: config.DATABASE_USER ?? 'postgres',
    DATABASE_PASSWORD: config.DATABASE_PASSWORD ?? 'postgres',
    DATABASE_SYNCHRONIZE: config.DATABASE_SYNCHRONIZE ?? 'false',
  };
  const validatedConfig = plainToInstance(EnvironmentVariables, normalizedConfig, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
