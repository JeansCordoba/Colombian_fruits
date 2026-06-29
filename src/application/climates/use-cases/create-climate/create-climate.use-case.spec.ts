import { Test, TestingModule } from '@nestjs/testing';
import { Climate } from '../../../../domain/climates/entities/climate.entity';
import { InvalidClimateDataException } from '../../../../domain/climates/exceptions/climate.exceptions';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { CreateClimateCommand } from './create-climate.command';
import { CreateClimateUseCase } from './create-climate.use-case';

describe('CreateClimateUseCase', () => {
    let useCase: CreateClimateUseCase;
    let climateRepository: jest.Mocked<ClimateRepositoryPort>;

    const inputCommand: CreateClimateCommand = new CreateClimateCommand('Tropical');
    const savedClimate: Climate = new Climate(
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
                CreateClimateUseCase,
                { provide: CLIMATE_REPOSITORY, useValue: climateRepository },
            ],
        }).compile();
        useCase = module.get(CreateClimateUseCase);
    });

    it('should create a climate when name is valid', async () => {
        climateRepository.save.mockResolvedValue(savedClimate);
        const actualClimate = await useCase.execute(inputCommand);
        expect(actualClimate).toEqual(savedClimate);
        expect(climateRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Tropical' }),
        );
    });

    it('should throw when name is empty', async () => {
        await expect(useCase.execute(new CreateClimateCommand('   '))).rejects.toThrow(
            InvalidClimateDataException,
        );
        expect(climateRepository.save).not.toHaveBeenCalled();
    });
});
