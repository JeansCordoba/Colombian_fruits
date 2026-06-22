import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FruitRepository } from "./fruits/fruit.repository";


export class DatabaseModule {
    static forRoot(): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST,
                port: parseInt(process.env.DATABASE_PORT ?? '5432'),
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
            })],
            exports: [TypeOrmModule, FruitRepository],
            providers: [
                {
                    provide: 'FruitRepository',
                    useClass: FruitRepository,
                },
            ],
        };
    }
}
