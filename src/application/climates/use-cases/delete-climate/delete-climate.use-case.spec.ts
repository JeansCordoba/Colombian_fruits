import { Test, TestingModule } from '@nestjs/testing';
import { Climate } from '../../../../domain/climates/entities/climate.entity';
import { ClimateNotFoundException } from '../../../../domain/climates/exceptions/climate.exceptions';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { DeleteClimateCommand } from './delete-climate.command';
import { DeleteClimateUseCase } from './delete-climate.use-case';

describe('DeleteClimateUseCase', () => {
    let useCase: DeleteClimateUseCase;
    let climateRepository: jest.Mocked<ClimateRepositoryPort>;

    const existingClimate: Climate = new Climate(
        1,
        'Tropical',
        new Date('2026-01-01'),
        new Date('2026-01-01'),
    );

    beforeEach(async () => {
        climateRepository = {
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
                DeleteClimateUseCase,
                { provide: CLIMATE_REPOSITORY, useValue: climateRepository },
            ],
        }).compile();
        useCase = module.get(DeleteClimateUseCase);
    });

    it('should soft-delete climate when it exists', async () => {
        climateRepository.findById.mockResolvedValue(existingClimate);
        climateRepository.softDelete.mockResolvedValue(undefined);
        await useCase.execute(new DeleteClimateCommand(1));
        expect(climateRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw when climate does not exist', async () => {
        climateRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new DeleteClimateCommand(99))).rejects.toThrow(
            ClimateNotFoundException,
        );
        expect(climateRepository.softDelete).not.toHaveBeenCalled();
    });
});
