import { Test, TestingModule } from '@nestjs/testing';
import { Climate } from '../../../../domain/climates/entities/climate.entity';
import { ClimateNotFoundException } from '../../../../domain/climates/exceptions/climate.exceptions';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { GetClimateByIdQuery } from './get-climate-by-id.query';
import { GetClimateByIdUseCase } from './get-climate-by-id.use-case';

describe('GetClimateByIdUseCase', () => {
    let useCase: GetClimateByIdUseCase;
    let climateRepository: jest.Mocked<ClimateRepositoryPort>;

    const climate: Climate = new Climate(
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
                GetClimateByIdUseCase,
                { provide: CLIMATE_REPOSITORY, useValue: climateRepository },
            ],
        }).compile();
        useCase = module.get(GetClimateByIdUseCase);
    });

    it('should return climate when it exists', async () => {
        climateRepository.findById.mockResolvedValue(climate);
        const actualClimate = await useCase.execute(new GetClimateByIdQuery(1));
        expect(actualClimate).toEqual(climate);
    });

    it('should throw when climate does not exist', async () => {
        climateRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new GetClimateByIdQuery(99))).rejects.toThrow(
            ClimateNotFoundException,
        );
    });
});
