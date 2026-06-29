import { Test, TestingModule } from '@nestjs/testing';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';
import { InvalidNaturalRegionDataException } from '../../../../domain/natural-regions/exceptions/natural-region.exceptions';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { CreateNaturalRegionCommand } from './create-natural-region.command';
import { CreateNaturalRegionUseCase } from './create-natural-region.use-case';

describe('CreateNaturalRegionUseCase', () => {
    let useCase: CreateNaturalRegionUseCase;
    let naturalRegionRepository: jest.Mocked<NaturalRegionRepositoryPort>;

    const inputCommand: CreateNaturalRegionCommand = new CreateNaturalRegionCommand('Andean Region');
    const savedNaturalRegion: NaturalRegion = new NaturalRegion(
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
                CreateNaturalRegionUseCase,
                { provide: NATURAL_REGION_REPOSITORY, useValue: naturalRegionRepository },
            ],
        }).compile();
        useCase = module.get(CreateNaturalRegionUseCase);
    });

    it('should create a natural region when name is valid', async () => {
        naturalRegionRepository.save.mockResolvedValue(savedNaturalRegion);
        const actualNaturalRegion = await useCase.execute(inputCommand);
        expect(actualNaturalRegion).toEqual(savedNaturalRegion);
        expect(naturalRegionRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Andean Region' }),
        );
    });

    it('should throw when name is empty', async () => {
        await expect(useCase.execute(new CreateNaturalRegionCommand('   '))).rejects.toThrow(
            InvalidNaturalRegionDataException,
        );
        expect(naturalRegionRepository.save).not.toHaveBeenCalled();
    });
});
