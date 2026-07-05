import { Inject, Injectable } from '@nestjs/common';
import { ClimateNotFoundException } from '../../../domain/climates/exceptions/climate.exceptions';
import { ClimateRepositoryPort } from '../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../domain/climates/repositories/climate.repository.token';
import { DepartmentNotFoundException } from '../../../domain/departments/exceptions/department.exceptions';
import { DepartmentRepositoryPort } from '../../../domain/departments/repositories/department.repository.port';
import { DEPARTMENT_REPOSITORY } from '../../../domain/departments/repositories/department.repository.token';
import { HarvestSeasonNotFoundException } from '../../../domain/harvest-seasons/exceptions/harvest-season.exceptions';
import { HarvestSeasonRepositoryPort } from '../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { NaturalRegionNotFoundException } from '../../../domain/natural-regions/exceptions/natural-region.exceptions';
import { NaturalRegionRepositoryPort } from '../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../domain/natural-regions/repositories/natural-region.repository.token';
import { FruitRelations } from '../../../domain/fruits/repositories/fruit.repository.port';

/**
 * Validates that all N:M relation ids exist in their respective master catalogs.
 * Uses findAll() per catalog — a single query per table — then searches in memory,
 * which is optimal for small, rarely-changing master tables.
 */
@Injectable()
export class FruitRelationsValidator {
    constructor(
        @Inject(CLIMATE_REPOSITORY)
        private readonly climateRepository: ClimateRepositoryPort,
        @Inject(DEPARTMENT_REPOSITORY)
        private readonly departmentRepository: DepartmentRepositoryPort,
        @Inject(NATURAL_REGION_REPOSITORY)
        private readonly naturalRegionRepository: NaturalRegionRepositoryPort,
        @Inject(HARVEST_SEASON_REPOSITORY)
        private readonly harvestSeasonRepository: HarvestSeasonRepositoryPort,
    ) {}

    async validate(relations: FruitRelations): Promise<void> {
        const [climates, departments, naturalRegions, harvestSeasons] = await Promise.all([
            this.climateRepository.findAll(),
            this.departmentRepository.findAll(),
            this.naturalRegionRepository.findAll(),
            this.harvestSeasonRepository.findAll(),
        ]);
        for (const climateId of relations.climateIds) {
            if (!climates.find((c) => c.id === climateId)) {
                throw new ClimateNotFoundException(climateId);
            }
        }
        for (const departmentId of relations.departmentIds) {
            if (!departments.find((d) => d.id === departmentId)) {
                throw new DepartmentNotFoundException(departmentId);
            }
        }
        for (const naturalRegionId of relations.naturalRegionIds) {
            if (!naturalRegions.find((r) => r.id === naturalRegionId)) {
                throw new NaturalRegionNotFoundException(naturalRegionId);
            }
        }
        for (const harvestSeasonId of relations.harvestSeasonIds) {
            if (!harvestSeasons.find((h) => h.id === harvestSeasonId)) {
                throw new HarvestSeasonNotFoundException(harvestSeasonId);
            }
        }
    }
}
