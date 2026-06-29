import { Test, TestingModule } from '@nestjs/testing';
import { Climate } from '../../../../domain/climates/entities/climate.entity';
import {
    ClimateNotFoundException,
    InvalidClimateDataException,
} from '../../../../domain/climates/exceptions/climate.exceptions';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { UpdateClimateCommand } from './update-climate.command';
import { UpdateClimateUseCase } from './update-climate.use-case';

describe('UpdateClimateUseCase', () => {
    let useCase: UpdateClimateUseCase;
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
                UpdateClimateUseCase,
                { provide: CLIMATE_REPOSITORY, useValue: climateRepository },
            ],
        }).compile();
        useCase = module.get(UpdateClimateUseCase);
    });

    it('should update climate when it exists', async () => {
        const inputCommand = new UpdateClimateCommand(1, 'Temperate');
        climateRepository.findById.mockResolvedValue(existingClimate);
        climateRepository.update.mockResolvedValue(
            new Climate(1, 'Temperate', existingClimate.createdAt, new Date('2026-02-01')),
        );
        const actualClimate = await useCase.execute(inputCommand);
        expect(actualClimate.name).toBe('Temperate');
    });

    it('should throw when climate does not exist', async () => {
        climateRepository.findById.mockResolvedValue(null);
        await expect(
            useCase.execute(new UpdateClimateCommand(99, 'Test')),
        ).rejects.toThrow(ClimateNotFoundException);
    });

    it('should throw when name is empty', async () => {
        climateRepository.findById.mockResolvedValue(existingClimate);
        await expect(
            useCase.execute(new UpdateClimateCommand(1, '   ')),
        ).rejects.toThrow(InvalidClimateDataException);
    });
});
