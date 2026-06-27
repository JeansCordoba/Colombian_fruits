import { Module } from '@nestjs/common';
import { ConfigModule } from '../infrastructure/config/config.module';
import { DatabaseModule } from '../infrastructure/persistence/database.module';
import { DepartmentsModule } from './http/departments/departments.module';

@Module({
    imports: [ConfigModule, DatabaseModule.forRoot(), DepartmentsModule],
})
export class AppModule {}
