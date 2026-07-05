import { Module } from '@nestjs/common';
import { ConfigModule } from '../infrastructure/config/config.module';
import { DatabaseModule } from '../infrastructure/persistence/database.module';
import { ClimatesModule } from './http/climates/climates.module';
import { DepartmentsModule } from './http/departments/departments.module';
import { FamiliesModule } from './http/families/families.module';
import { HarvestSeasonsModule } from './http/harvest-seasons/harvest-seasons.module';
import { NaturalRegionsModule } from './http/natural-regions/natural-regions.module';
import { TypeFruitsModule } from './http/type-fruits/type-fruits.module';
import { TypePlantsModule } from './http/type-plants/type-plants.module';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule.forRoot(),
        DepartmentsModule,
        TypePlantsModule,
        TypeFruitsModule,
        ClimatesModule,
        NaturalRegionsModule,
        HarvestSeasonsModule,
        FamiliesModule,
    ],
})
export class AppModule {}
