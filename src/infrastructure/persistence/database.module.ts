import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../config/database.config';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const databaseConfig = configService.get<DatabaseConfig>('database');
            if (!databaseConfig) {
              throw new Error('Database configuration is missing.');
            }
            return {
              type: 'postgres' as const,
              host: databaseConfig.host,
              port: databaseConfig.port,
              username: databaseConfig.user,
              password: databaseConfig.password,
              database: databaseConfig.name,
              autoLoadEntities: false,
              synchronize: false,
            };
          },
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
