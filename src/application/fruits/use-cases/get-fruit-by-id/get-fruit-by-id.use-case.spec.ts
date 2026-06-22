import { Test, TestingModule } from '@nestjs/testing';
import { Fruit } from '../../../../domain/fruits/entities/fruit.entity';
import { FruitNotFoundException } from '../../../../domain/fruits/exceptions/fruit.exceptions';
import { FruitRepositoryPort } from '../../../../domain/fruits/repositories/fruit.repository.port';
import { FRUIT_REPOSITORY } from '../../../../domain/fruits/repositories/fruit.repository.token';
import { GetFruitByIdCommand } from './get-fruit-by-id.command';
import { GetFruitByIdUseCase } from './get-fruit-by-id.use-case';

describe('GetFruitByIdUseCase', () => {
  let useCase: GetFruitByIdUseCase;
  let fruitRepository: jest.Mocked<FruitRepositoryPort>;

  const mockFruit: Fruit = new Fruit(
    10,
    'Granadilla',
    'Passiflora ligularis',
    'Fruta de la familia Passifloraceae',
    1,
    2,
    new Date('2026-06-20'),
    new Date('2026-06-20'),
  );

  beforeEach(async () => {
    const mockFruitRepository: jest.Mocked<FruitRepositoryPort> = {
      save: jest.fn(),
      findById: jest.fn(),
      findByScientificName: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetFruitByIdUseCase,
        { provide: FRUIT_REPOSITORY, useValue: mockFruitRepository },
      ],
    }).compile();
    useCase = module.get<GetFruitByIdUseCase>(GetFruitByIdUseCase);
    fruitRepository = module.get(FRUIT_REPOSITORY);
  });

  it('should return a fruit when it exists', async () => {
    const inputCommand: GetFruitByIdCommand = new GetFruitByIdCommand(10);
    fruitRepository.findById.mockResolvedValue(mockFruit);
    const actualFruit: Fruit = await useCase.execute(inputCommand);
    expect(fruitRepository.findById).toHaveBeenCalledWith(10);
    expect(actualFruit).toBe(mockFruit);
  });

  it('should throw FruitNotFoundException when fruit does not exist', async () => {
    const inputCommand: GetFruitByIdCommand = new GetFruitByIdCommand(999);
    fruitRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(inputCommand)).rejects.toThrow(FruitNotFoundException);
  });
});
