import { Test, TestingModule } from '@nestjs/testing';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitNotFoundException } from '../../../../domain/type-fruits/exceptions/type-fruit.exceptions';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { GetTypeFruitByIdQuery } from './get-type-fruit-by-id.query';
import { GetTypeFruitByIdUseCase } from './get-type-fruit-by-id.use-case';

describe('GetTypeFruitByIdUseCase', () => {
    let useCase: GetTypeFruitByIdUseCase;
    let typeFruitRepository: jest.Mocked<TypeFruitRepositoryPort>;

    const typeFruit: TypeFruit = new TypeFruit(
        1,
        'Citrus',
        'Acidic fruits',
        new Date('2026-01-01'),
        new Date('2026-01-01'),
    );

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
                GetTypeFruitByIdUseCase,
                { provide: TYPE_FRUIT_REPOSITORY, useValue: typeFruitRepository },
            ],
        }).compile();
        useCase = module.get(GetTypeFruitByIdUseCase);
    });

    it('should return type fruit when it exists', async () => {
        typeFruitRepository.findById.mockResolvedValue(typeFruit);
        const actualTypeFruit = await useCase.execute(new GetTypeFruitByIdQuery(1));
        expect(actualTypeFruit).toEqual(typeFruit);
    });

    it('should throw when type fruit does not exist', async () => {
        typeFruitRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new GetTypeFruitByIdQuery(99))).rejects.toThrow(
            TypeFruitNotFoundException,
        );
    });
});
