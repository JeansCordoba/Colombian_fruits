import { Test, TestingModule } from '@nestjs/testing';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { CreateTypeFruitCommand } from './create-type-fruit.command';
import { CreateTypeFruitUseCase } from './create-type-fruit.use-case';

describe('CreateTypeFruitUseCase', () => {
    let useCase: CreateTypeFruitUseCase;
    let typeFruitRepository: jest.Mocked<TypeFruitRepositoryPort>;

    const inputCommand: CreateTypeFruitCommand = new CreateTypeFruitCommand('Citrus', 'Acidic fruits');
    const savedTypeFruit: TypeFruit = new TypeFruit(
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
                CreateTypeFruitUseCase,
                { provide: TYPE_FRUIT_REPOSITORY, useValue: typeFruitRepository },
            ],
        }).compile();
        useCase = module.get(CreateTypeFruitUseCase);
    });

    it('should create a type fruit', async () => {
        typeFruitRepository.save.mockResolvedValue(savedTypeFruit);
        const actualTypeFruit = await useCase.execute(inputCommand);
        expect(actualTypeFruit).toEqual(savedTypeFruit);
        expect(typeFruitRepository.save).toHaveBeenCalled();
    });

    it('should create a type fruit without description', async () => {
        const commandWithoutDescription = new CreateTypeFruitCommand('Berry', null);
        const savedWithoutDescription = new TypeFruit(
            2,
            'Berry',
            null,
            new Date('2026-01-01'),
            new Date('2026-01-01'),
        );
        typeFruitRepository.save.mockResolvedValue(savedWithoutDescription);
        const actualTypeFruit = await useCase.execute(commandWithoutDescription);
        expect(actualTypeFruit.description).toBeNull();
    });
});
