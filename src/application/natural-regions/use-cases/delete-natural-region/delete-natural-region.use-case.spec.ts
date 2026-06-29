import { Test, TestingModule } from '@nestjs/testing';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';
import { NaturalRegionNotFoundException } from '../../../../domain/natural-regions/exceptions/natural-region.exceptions';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { DeleteNaturalRegionCommand } from './delete-natural-region.command';
import { DeleteNaturalRegionUseCase } from './delete-natural-region.use-case';

describe('DeleteNaturalRegionUseCase', () => {
    let useCase: DeleteNaturalRegionUseCase;
    let naturalRegionRepository: jest.Mocked<NaturalRegionRepositoryPort>;

    const existingNaturalRegion: NaturalRegion = new NaturalRegion(
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
                DeleteNaturalRegionUseCase,
                { provide: NATURAL_REGION_REPOSITORY, useValue: naturalRegionRepository },
            ],
        }).compile();
        useCase = module.get(DeleteNaturalRegionUseCase);
    });

    it('should soft-delete natural region when it exists', async () => {
        naturalRegionRepository.findById.mockResolvedValue(existingNaturalRegion);
        naturalRegionRepository.softDelete.mockResolvedValue(undefined);
        await useCase.execute(new DeleteNaturalRegionCommand(1));
        expect(naturalRegionRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw when natural region does not exist', async () => {
        naturalRegionRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new DeleteNaturalRegionCommand(99))).rejects.toThrow(
            NaturalRegionNotFoundException,
        );
        expect(naturalRegionRepository.softDelete).not.toHaveBeenCalled();
    });
});
