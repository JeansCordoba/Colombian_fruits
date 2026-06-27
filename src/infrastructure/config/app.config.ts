import { registerAs } from '@nestjs/config';

const DEFAULT_PORT = 3000;

export interface AppConfig {
  port: number;
  nodeEnv: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: Number(process.env.PORT ?? DEFAULT_PORT),
    nodeEnv: process.env.NODE_ENV ?? 'development',
  }),
);
