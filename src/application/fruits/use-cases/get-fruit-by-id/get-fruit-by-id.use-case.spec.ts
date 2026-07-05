import { Test, TestingModule } from '@nestjs/testing';
import { FruitNotFoundException } from '../../../../domain/fruits/exceptions/fruit.exceptions';
import { FruitWithRelations } from '../../../../domain/fruits/read-models/fruit-with-relations.read-model';
import { FruitRepositoryPort } from '../../../../domain/fruits/repositories/fruit.repository.port';
import { FRUIT_REPOSITORY } from '../../../../domain/fruits/repositories/fruit.repository.token';
import { GetFruitByIdCommand } from './get-fruit-by-id.command';
import { GetFruitByIdUseCase } from './get-fruit-by-id.use-case';

describe('GetFruitByIdUseCase', () => {
    let useCase: GetFruitByIdUseCase;
    let fruitRepository: jest.Mocked<FruitRepositoryPort>;

    const mockFruit: FruitWithRelations = {
        id: 10,
        commonName: 'Granadilla',
        scientificName: 'Passiflora ligularis',
        description: 'Fruta de la familia Passifloraceae',
        family: {
            id: 1,
            name: 'Passifloraceae',
            typePlant: { id: 3, name: 'Vine' },
        },
        typeFruit: { id: 2, name: 'Berry' },
        climates: [{ id: 1, name: 'Tropical' }],
        departments: [{ id: 5, name: 'Cundinamarca' }],
        naturalRegions: [{ id: 2, name: 'Andean' }],
        harvestSeasons: [{ id: 3, startMonth: 1, endMonth: 12 }],
        createdAt: new Date('2026-06-20'),
        updatedAt: new Date('2026-06-20'),
    };

    beforeEach(async () => {
        fruitRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByIdWithRelations: jest.fn(),
            findByScientificName: jest.fn(),
            findPaginated: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetFruitByIdUseCase,
                { provide: FRUIT_REPOSITORY, useValue: fruitRepository },
            ],
        }).compile();
        useCase = module.get(GetFruitByIdUseCase);
    });

    it('should return a fruit when it exists', async () => {
        fruitRepository.findByIdWithRelations.mockResolvedValue(mockFruit);
        const actualFruit = await useCase.execute(new GetFruitByIdCommand(10));
        expect(fruitRepository.findByIdWithRelations).toHaveBeenCalledWith(10);
        expect(actualFruit).toBe(mockFruit);
    });

    it('should throw FruitNotFoundException when fruit does not exist', async () => {
        fruitRepository.findByIdWithRelations.mockResolvedValue(null);
        await expect(useCase.execute(new GetFruitByIdCommand(999))).rejects.toThrow(FruitNotFoundException);
    });
});
