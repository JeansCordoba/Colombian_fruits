import { Test, TestingModule } from '@nestjs/testing';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { ListHarvestSeasonsQuery } from './list-harvest-seasons.query';
import { ListHarvestSeasonsUseCase } from './list-harvest-seasons.use-case';

describe('ListHarvestSeasonsUseCase', () => {
    let useCase: ListHarvestSeasonsUseCase;
    let harvestSeasonRepository: jest.Mocked<HarvestSeasonRepositoryPort>;

    const harvestSeasons: HarvestSeason[] = [
        new HarvestSeason(1, 1, 3, new Date('2026-01-01'), new Date('2026-01-01')),
    ];

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
                ListHarvestSeasonsUseCase,
                { provide: HARVEST_SEASON_REPOSITORY, useValue: harvestSeasonRepository },
            ],
        }).compile();
        useCase = module.get(ListHarvestSeasonsUseCase);
    });

    it('should return paginated harvest seasons', async () => {
        harvestSeasonRepository.findPaginated.mockResolvedValue(harvestSeasons);
        harvestSeasonRepository.count.mockResolvedValue(1);
        const actualResult = await useCase.execute(new ListHarvestSeasonsQuery(1, 20));
        expect(actualResult.data).toEqual(harvestSeasons);
        expect(actualResult.meta).toEqual({
            total: 1,
            page: 1,
            limit: 20,
            totalPages: 1,
        });
    });

    it('should cap limit to max allowed value', async () => {
        harvestSeasonRepository.findPaginated.mockResolvedValue([]);
        harvestSeasonRepository.count.mockResolvedValue(0);
        await useCase.execute(new ListHarvestSeasonsQuery(1, 500));
        expect(harvestSeasonRepository.findPaginated).toHaveBeenCalledWith(1, 100);
    });
});
