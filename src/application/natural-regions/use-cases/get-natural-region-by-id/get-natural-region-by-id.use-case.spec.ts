import { Test, TestingModule } from '@nestjs/testing';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';
import { NaturalRegionNotFoundException } from '../../../../domain/natural-regions/exceptions/natural-region.exceptions';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { GetNaturalRegionByIdQuery } from './get-natural-region-by-id.query';
import { GetNaturalRegionByIdUseCase } from './get-natural-region-by-id.use-case';

describe('GetNaturalRegionByIdUseCase', () => {
    let useCase: GetNaturalRegionByIdUseCase;
    let naturalRegionRepository: jest.Mocked<NaturalRegionRepositoryPort>;

    const naturalRegion: NaturalRegion = new NaturalRegion(
        1,
        'Andean Region',
        new Date('2026-01-01'),
        new Date('2026-01-01'),
    );

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
                GetNaturalRegionByIdUseCase,
                { provide: NATURAL_REGION_REPOSITORY, useValue: naturalRegionRepository },
            ],
        }).compile();
        useCase = module.get(GetNaturalRegionByIdUseCase);
    });

    it('should return natural region when it exists', async () => {
        naturalRegionRepository.findById.mockResolvedValue(naturalRegion);
        const actualNaturalRegion = await useCase.execute(new GetNaturalRegionByIdQuery(1));
        expect(actualNaturalRegion).toEqual(naturalRegion);
    });

    it('should throw when natural region does not exist', async () => {
        naturalRegionRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new GetNaturalRegionByIdQuery(99))).rejects.toThrow(
            NaturalRegionNotFoundException,
        );
    });
});
