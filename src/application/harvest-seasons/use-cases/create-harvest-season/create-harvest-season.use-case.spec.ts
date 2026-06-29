import { Test, TestingModule } from '@nestjs/testing';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';
import { InvalidHarvestSeasonDataException } from '../../../../domain/harvest-seasons/exceptions/harvest-season.exceptions';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { CreateHarvestSeasonCommand } from './create-harvest-season.command';
import { CreateHarvestSeasonUseCase } from './create-harvest-season.use-case';

describe('CreateHarvestSeasonUseCase', () => {
    let useCase: CreateHarvestSeasonUseCase;
    let harvestSeasonRepository: jest.Mocked<HarvestSeasonRepositoryPort>;

    const inputCommand: CreateHarvestSeasonCommand = new CreateHarvestSeasonCommand(1, 3);
    const savedHarvestSeason: HarvestSeason = new HarvestSeason(
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
                CreateHarvestSeasonUseCase,
                { provide: HARVEST_SEASON_REPOSITORY, useValue: harvestSeasonRepository },
            ],
        }).compile();
        useCase = module.get(CreateHarvestSeasonUseCase);
    });

    it('should create a harvest season when months are valid', async () => {
        harvestSeasonRepository.save.mockResolvedValue(savedHarvestSeason);
        const actualHarvestSeason = await useCase.execute(inputCommand);
        expect(actualHarvestSeason).toEqual(savedHarvestSeason);
    });

    it('should throw when startMonth is invalid', async () => {
        await expect(useCase.execute(new CreateHarvestSeasonCommand(0, 3))).rejects.toThrow(
            InvalidHarvestSeasonDataException,
        );
        expect(harvestSeasonRepository.save).not.toHaveBeenCalled();
    });

    it('should throw when endMonth is invalid', async () => {
        await expect(useCase.execute(new CreateHarvestSeasonCommand(1, 13))).rejects.toThrow(
            InvalidHarvestSeasonDataException,
        );
        expect(harvestSeasonRepository.save).not.toHaveBeenCalled();
    });
});
