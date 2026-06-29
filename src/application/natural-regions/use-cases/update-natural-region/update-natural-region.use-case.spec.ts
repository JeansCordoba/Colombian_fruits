import { Test, TestingModule } from '@nestjs/testing';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';
import {
    InvalidNaturalRegionDataException,
    NaturalRegionNotFoundException,
} from '../../../../domain/natural-regions/exceptions/natural-region.exceptions';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { UpdateNaturalRegionCommand } from './update-natural-region.command';
import { UpdateNaturalRegionUseCase } from './update-natural-region.use-case';

describe('UpdateNaturalRegionUseCase', () => {
    let useCase: UpdateNaturalRegionUseCase;
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
                UpdateNaturalRegionUseCase,
                { provide: NATURAL_REGION_REPOSITORY, useValue: naturalRegionRepository },
            ],
        }).compile();
        useCase = module.get(UpdateNaturalRegionUseCase);
    });

    it('should update natural region when it exists', async () => {
        const inputCommand = new UpdateNaturalRegionCommand(1, 'Caribbean Region');
        naturalRegionRepository.findById.mockResolvedValue(existingNaturalRegion);
        naturalRegionRepository.update.mockResolvedValue(
            new NaturalRegion(1, 'Caribbean Region', existingNaturalRegion.createdAt, new Date('2026-02-01')),
        );
        const actualNaturalRegion = await useCase.execute(inputCommand);
        expect(actualNaturalRegion.name).toBe('Caribbean Region');
    });

    it('should throw when natural region does not exist', async () => {
        naturalRegionRepository.findById.mockResolvedValue(null);
        await expect(
            useCase.execute(new UpdateNaturalRegionCommand(99, 'Test')),
        ).rejects.toThrow(NaturalRegionNotFoundException);
    });

    it('should throw when name is empty', async () => {
        naturalRegionRepository.findById.mockResolvedValue(existingNaturalRegion);
        await expect(
            useCase.execute(new UpdateNaturalRegionCommand(1, '   ')),
        ).rejects.toThrow(InvalidNaturalRegionDataException);
    });
});
