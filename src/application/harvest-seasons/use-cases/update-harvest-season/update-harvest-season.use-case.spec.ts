import { Test, TestingModule } from '@nestjs/testing';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';
import {
    HarvestSeasonNotFoundException,
    InvalidHarvestSeasonDataException,
} from '../../../../domain/harvest-seasons/exceptions/harvest-season.exceptions';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { UpdateHarvestSeasonCommand } from './update-harvest-season.command';
import { UpdateHarvestSeasonUseCase } from './update-harvest-season.use-case';

describe('UpdateHarvestSeasonUseCase', () => {
    let useCase: UpdateHarvestSeasonUseCase;
    let harvestSeasonRepository: jest.Mocked<HarvestSeasonRepositoryPort>;

    const existingHarvestSeason: HarvestSeason = new HarvestSeason(
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
                UpdateHarvestSeasonUseCase,
                { provide: HARVEST_SEASON_REPOSITORY, useValue: harvestSeasonRepository },
            ],
        }).compile();
        useCase = module.get(UpdateHarvestSeasonUseCase);
    });

    it('should update harvest season when it exists', async () => {
        const inputCommand = new UpdateHarvestSeasonCommand(1, 4, 6);
        harvestSeasonRepository.findById.mockResolvedValue(existingHarvestSeason);
        harvestSeasonRepository.update.mockResolvedValue(
            new HarvestSeason(1, 4, 6, existingHarvestSeason.createdAt, new Date('2026-02-01')),
        );
        const actualHarvestSeason = await useCase.execute(inputCommand);
        expect(actualHarvestSeason.startMonth).toBe(4);
        expect(actualHarvestSeason.endMonth).toBe(6);
    });

    it('should throw when harvest season does not exist', async () => {
        harvestSeasonRepository.findById.mockResolvedValue(null);
        await expect(
            useCase.execute(new UpdateHarvestSeasonCommand(99, 1, 3)),
        ).rejects.toThrow(HarvestSeasonNotFoundException);
    });

    it('should throw when months are invalid', async () => {
        harvestSeasonRepository.findById.mockResolvedValue(existingHarvestSeason);
        await expect(
            useCase.execute(new UpdateHarvestSeasonCommand(1, 0, 3)),
        ).rejects.toThrow(InvalidHarvestSeasonDataException);
        expect(harvestSeasonRepository.update).not.toHaveBeenCalled();
    });
});
