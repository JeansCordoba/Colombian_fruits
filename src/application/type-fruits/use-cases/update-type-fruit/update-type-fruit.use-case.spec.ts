import { Test, TestingModule } from '@nestjs/testing';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitNotFoundException } from '../../../../domain/type-fruits/exceptions/type-fruit.exceptions';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { UpdateTypeFruitCommand } from './update-type-fruit.command';
import { UpdateTypeFruitUseCase } from './update-type-fruit.use-case';

describe('UpdateTypeFruitUseCase', () => {
    let useCase: UpdateTypeFruitUseCase;
    let typeFruitRepository: jest.Mocked<TypeFruitRepositoryPort>;

    const existingTypeFruit: TypeFruit = new TypeFruit(
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
                UpdateTypeFruitUseCase,
                { provide: TYPE_FRUIT_REPOSITORY, useValue: typeFruitRepository },
            ],
        }).compile();
        useCase = module.get(UpdateTypeFruitUseCase);
    });

    it('should update type fruit when it exists', async () => {
        const inputCommand = new UpdateTypeFruitCommand(1, 'Citrus Updated', 'Updated description');
        typeFruitRepository.findById.mockResolvedValue(existingTypeFruit);
        typeFruitRepository.update.mockResolvedValue(
            new TypeFruit(1, 'Citrus Updated', 'Updated description', existingTypeFruit.createdAt, new Date('2026-02-01')),
        );
        const actualTypeFruit = await useCase.execute(inputCommand);
        expect(actualTypeFruit.name).toBe('Citrus Updated');
        expect(actualTypeFruit.description).toBe('Updated description');
    });

    it('should keep existing description when not provided', async () => {
        const inputCommand = new UpdateTypeFruitCommand(1, 'Citrus Updated', undefined);
        typeFruitRepository.findById.mockResolvedValue(existingTypeFruit);
        typeFruitRepository.update.mockResolvedValue(
            new TypeFruit(1, 'Citrus Updated', 'Acidic fruits', existingTypeFruit.createdAt, new Date('2026-02-01')),
        );
        const actualTypeFruit = await useCase.execute(inputCommand);
        expect(actualTypeFruit.description).toBe('Acidic fruits');
    });

    it('should throw when type fruit does not exist', async () => {
        typeFruitRepository.findById.mockResolvedValue(null);
        await expect(
            useCase.execute(new UpdateTypeFruitCommand(99, 'Test', null)),
        ).rejects.toThrow(TypeFruitNotFoundException);
    });
});
