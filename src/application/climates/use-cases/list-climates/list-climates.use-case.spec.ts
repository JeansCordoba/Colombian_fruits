import { Test, TestingModule } from '@nestjs/testing';
import { Climate } from '../../../../domain/climates/entities/climate.entity';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { ListClimatesQuery } from './list-climates.query';
import { ListClimatesUseCase } from './list-climates.use-case';

describe('ListClimatesUseCase', () => {
    let useCase: ListClimatesUseCase;
    let climateRepository: jest.Mocked<ClimateRepositoryPort>;

    const climates: Climate[] = [
        new Climate(1, 'Tropical', new Date('2026-01-01'), new Date('2026-01-01')),
    ];

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
                ListClimatesUseCase,
                { provide: CLIMATE_REPOSITORY, useValue: climateRepository },
            ],
        }).compile();
        useCase = module.get(ListClimatesUseCase);
    });

    it('should return paginated climates', async () => {
        climateRepository.findPaginated.mockResolvedValue(climates);
        climateRepository.count.mockResolvedValue(1);
        const actualResult = await useCase.execute(new ListClimatesQuery(1, 20));
        expect(actualResult.data).toEqual(climates);
        expect(actualResult.meta).toEqual({
            total: 1,
            page: 1,
            limit: 20,
            totalPages: 1,
        });
    });

    it('should cap limit to max allowed value', async () => {
        climateRepository.findPaginated.mockResolvedValue([]);
        climateRepository.count.mockResolvedValue(0);
        await useCase.execute(new ListClimatesQuery(1, 500));
        expect(climateRepository.findPaginated).toHaveBeenCalledWith(1, 100);
    });
});
