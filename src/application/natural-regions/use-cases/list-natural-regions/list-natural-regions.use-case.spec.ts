import { Test, TestingModule } from '@nestjs/testing';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { ListNaturalRegionsQuery } from './list-natural-regions.query';
import { ListNaturalRegionsUseCase } from './list-natural-regions.use-case';

describe('ListNaturalRegionsUseCase', () => {
    let useCase: ListNaturalRegionsUseCase;
    let naturalRegionRepository: jest.Mocked<NaturalRegionRepositoryPort>;

    const naturalRegions: NaturalRegion[] = [
        new NaturalRegion(1, 'Andean Region', new Date('2026-01-01'), new Date('2026-01-01')),
    ];

    beforeEach(async () => {
        naturalRegionRepository = {
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
                ListNaturalRegionsUseCase,
                { provide: NATURAL_REGION_REPOSITORY, useValue: naturalRegionRepository },
            ],
        }).compile();
        useCase = module.get(ListNaturalRegionsUseCase);
    });

    it('should return paginated natural regions', async () => {
        naturalRegionRepository.findPaginated.mockResolvedValue(naturalRegions);
        naturalRegionRepository.count.mockResolvedValue(1);
        const actualResult = await useCase.execute(new ListNaturalRegionsQuery(1, 20));
        expect(actualResult.data).toEqual(naturalRegions);
        expect(actualResult.meta).toEqual({
            total: 1,
            page: 1,
            limit: 20,
            totalPages: 1,
        });
    });

    it('should cap limit to max allowed value', async () => {
        naturalRegionRepository.findPaginated.mockResolvedValue([]);
        naturalRegionRepository.count.mockResolvedValue(0);
        await useCase.execute(new ListNaturalRegionsQuery(1, 500));
        expect(naturalRegionRepository.findPaginated).toHaveBeenCalledWith(1, 100);
    });
});
