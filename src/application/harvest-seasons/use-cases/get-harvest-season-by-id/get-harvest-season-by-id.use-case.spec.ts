import { Test, TestingModule } from '@nestjs/testing';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';
import { HarvestSeasonNotFoundException } from '../../../../domain/harvest-seasons/exceptions/harvest-season.exceptions';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { GetHarvestSeasonByIdQuery } from './get-harvest-season-by-id.query';
import { GetHarvestSeasonByIdUseCase } from './get-harvest-season-by-id.use-case';

describe('GetHarvestSeasonByIdUseCase', () => {
    let useCase: GetHarvestSeasonByIdUseCase;
    let harvestSeasonRepository: jest.Mocked<HarvestSeasonRepositoryPort>;

    const harvestSeason: HarvestSeason = new HarvestSeason(
        1,
        1,
        3,
        new Date('2026-01-01'),
        new Date('2026-01-01'),
    );

    beforeEach(async () => {
        harvestSeasonRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findPaginated: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetHarvestSeasonByIdUseCase,
                { provide: HARVEST_SEASON_REPOSITORY, useValue: harvestSeasonRepository },
            ],
        }).compile();
        useCase = module.get(GetHarvestSeasonByIdUseCase);
    });

    it('should return harvest season when it exists', async () => {
        harvestSeasonRepository.findById.mockResolvedValue(harvestSeason);
        const actualHarvestSeason = await useCase.execute(new GetHarvestSeasonByIdQuery(1));
        expect(actualHarvestSeason).toEqual(harvestSeason);
    });

    it('should throw when harvest season does not exist', async () => {
        harvestSeasonRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new GetHarvestSeasonByIdQuery(99))).rejects.toThrow(
            HarvestSeasonNotFoundException,
        );
    });
});
