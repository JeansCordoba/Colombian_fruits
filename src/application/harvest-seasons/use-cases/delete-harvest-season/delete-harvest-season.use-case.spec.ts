import { Test, TestingModule } from '@nestjs/testing';
import { HarvestSeason } from '../../../../domain/harvest-seasons/entities/harvest-season.entity';
import { HarvestSeasonNotFoundException } from '../../../../domain/harvest-seasons/exceptions/harvest-season.exceptions';
import { HarvestSeasonRepositoryPort } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.port';
import { HARVEST_SEASON_REPOSITORY } from '../../../../domain/harvest-seasons/repositories/harvest-season.repository.token';
import { DeleteHarvestSeasonCommand } from './delete-harvest-season.command';
import { DeleteHarvestSeasonUseCase } from './delete-harvest-season.use-case';

describe('DeleteHarvestSeasonUseCase', () => {
    let useCase: DeleteHarvestSeasonUseCase;
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
                DeleteHarvestSeasonUseCase,
                { provide: HARVEST_SEASON_REPOSITORY, useValue: harvestSeasonRepository },
            ],
        }).compile();
        useCase = module.get(DeleteHarvestSeasonUseCase);
    });

    it('should soft-delete harvest season when it exists', async () => {
        harvestSeasonRepository.findById.mockResolvedValue(existingHarvestSeason);
        harvestSeasonRepository.softDelete.mockResolvedValue(undefined);
        await useCase.execute(new DeleteHarvestSeasonCommand(1));
        expect(harvestSeasonRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw when harvest season does not exist', async () => {
        harvestSeasonRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new DeleteHarvestSeasonCommand(99))).rejects.toThrow(
            HarvestSeasonNotFoundException,
        );
        expect(harvestSeasonRepository.softDelete).not.toHaveBeenCalled();
    });
});
