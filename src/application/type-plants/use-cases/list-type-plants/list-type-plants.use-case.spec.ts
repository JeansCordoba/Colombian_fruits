import { Test, TestingModule } from '@nestjs/testing';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { ListTypePlantsQuery } from './list-type-plants.query';
import { ListTypePlantsUseCase } from './list-type-plants.use-case';

describe('ListTypePlantsUseCase', () => {
    let useCase: ListTypePlantsUseCase;
    let typePlantRepository: jest.Mocked<TypePlantRepositoryPort>;

    const typePlants: TypePlant[] = [
        new TypePlant(1, 'Arbusto', new Date('2026-01-01'), new Date('2026-01-01')),
    ];

    beforeEach(async () => {
        typePlantRepository = {
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
                ListTypePlantsUseCase,
                { provide: TYPE_PLANT_REPOSITORY, useValue: typePlantRepository },
            ],
        }).compile();
        useCase = module.get(ListTypePlantsUseCase);
    });

    it('should return paginated type plants', async () => {
        typePlantRepository.findPaginated.mockResolvedValue(typePlants);
        typePlantRepository.count.mockResolvedValue(1);
        const actualResult = await useCase.execute(new ListTypePlantsQuery(1, 20));
        expect(actualResult.data).toEqual(typePlants);
        expect(actualResult.meta).toEqual({
            total: 1,
            page: 1,
            limit: 20,
            totalPages: 1,
        });
    });

    it('should cap limit to max allowed value', async () => {
        typePlantRepository.findPaginated.mockResolvedValue([]);
        typePlantRepository.count.mockResolvedValue(0);
        await useCase.execute(new ListTypePlantsQuery(1, 500));
        expect(typePlantRepository.findPaginated).toHaveBeenCalledWith(1, 100);
    });
});
