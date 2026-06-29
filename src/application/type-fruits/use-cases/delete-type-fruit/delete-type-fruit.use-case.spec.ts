import { Test, TestingModule } from '@nestjs/testing';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitNotFoundException } from '../../../../domain/type-fruits/exceptions/type-fruit.exceptions';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { DeleteTypeFruitCommand } from './delete-type-fruit.command';
import { DeleteTypeFruitUseCase } from './delete-type-fruit.use-case';

describe('DeleteTypeFruitUseCase', () => {
    let useCase: DeleteTypeFruitUseCase;
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
                DeleteTypeFruitUseCase,
                { provide: TYPE_FRUIT_REPOSITORY, useValue: typeFruitRepository },
            ],
        }).compile();
        useCase = module.get(DeleteTypeFruitUseCase);
    });

    it('should soft-delete type fruit when it exists', async () => {
        typeFruitRepository.findById.mockResolvedValue(existingTypeFruit);
        typeFruitRepository.softDelete.mockResolvedValue(undefined);
        await useCase.execute(new DeleteTypeFruitCommand(1));
        expect(typeFruitRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw when type fruit does not exist', async () => {
        typeFruitRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new DeleteTypeFruitCommand(99))).rejects.toThrow(
            TypeFruitNotFoundException,
        );
        expect(typeFruitRepository.softDelete).not.toHaveBeenCalled();
    });
});
