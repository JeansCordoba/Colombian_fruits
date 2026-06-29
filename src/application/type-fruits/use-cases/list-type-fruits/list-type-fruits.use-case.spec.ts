import { Test, TestingModule } from '@nestjs/testing';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { ListTypeFruitsQuery } from './list-type-fruits.query';
import { ListTypeFruitsUseCase } from './list-type-fruits.use-case';

describe('ListTypeFruitsUseCase', () => {
    let useCase: ListTypeFruitsUseCase;
    let typeFruitRepository: jest.Mocked<TypeFruitRepositoryPort>;

    const typeFruits: TypeFruit[] = [
        new TypeFruit(1, 'Citrus', 'Acidic fruits', new Date('2026-01-01'), new Date('2026-01-01')),
    ];

    beforeEach(async () => {
        typeFruitRepository = {
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
                ListTypeFruitsUseCase,
                { provide: TYPE_FRUIT_REPOSITORY, useValue: typeFruitRepository },
            ],
        }).compile();
        useCase = module.get(ListTypeFruitsUseCase);
    });

    it('should return paginated type fruits', async () => {
        typeFruitRepository.findPaginated.mockResolvedValue(typeFruits);
        typeFruitRepository.count.mockResolvedValue(1);
        const actualResult = await useCase.execute(new ListTypeFruitsQuery(1, 20));
        expect(actualResult.data).toEqual(typeFruits);
        expect(actualResult.meta).toEqual({
            total: 1,
            page: 1,
            limit: 20,
            totalPages: 1,
        });
    });

    it('should cap limit to max allowed value', async () => {
        typeFruitRepository.findPaginated.mockResolvedValue([]);
        typeFruitRepository.count.mockResolvedValue(0);
        await useCase.execute(new ListTypeFruitsQuery(1, 500));
        expect(typeFruitRepository.findPaginated).toHaveBeenCalledWith(1, 100);
    });
});
