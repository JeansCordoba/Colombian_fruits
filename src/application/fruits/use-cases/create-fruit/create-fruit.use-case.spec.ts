import { Test, TestingModule } from '@nestjs/testing';
import { Family } from '../../../../domain/families/entities/family.entity';
import { FamilyNotFoundException } from '../../../../domain/families/exceptions/family.exceptions';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { Fruit } from '../../../../domain/fruits/entities/fruit.entity';
import { DuplicateFruitScientificNameException } from '../../../../domain/fruits/exceptions/fruit.exceptions';
import { FruitRepositoryPort } from '../../../../domain/fruits/repositories/fruit.repository.port';
import { FRUIT_REPOSITORY } from '../../../../domain/fruits/repositories/fruit.repository.token';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitNotFoundException } from '../../../../domain/type-fruits/exceptions/type-fruit.exceptions';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { CreateFruitCommand } from './create-fruit.command';
import { CreateFruitUseCase } from './create-fruit.use-case';

describe('CreateFruitUseCase', () => {
  let useCase: CreateFruitUseCase;
  let fruitRepository: jest.Mocked<FruitRepositoryPort>;
  let familyRepository: jest.Mocked<FamilyRepositoryPort>;
  let typeFruitRepository: jest.Mocked<TypeFruitRepositoryPort>;

  const mockFamily: Family = new Family(
    1,
    'Passifloraceae',
    3,
    new Date('2026-01-01'),
    new Date('2026-01-01'),
  );

  const mockTypeFruit: TypeFruit = new TypeFruit(
    2,
    'Berry',
    new Date('2026-01-01'),
    new Date('2026-01-01'),
  );

  const inputCommand: CreateFruitCommand = new CreateFruitCommand(
    'Granadilla',
    'Passiflora ligularis',
    'Fruta de la familia Passifloraceae',
    1,
    2,
    [1],
    [5, 11],
    [2],
    [3],
  );

  const expectedSavedFruit: Fruit = new Fruit(
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
    const mockFamilyRepository: jest.Mocked<FamilyRepositoryPort> = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };
    const mockTypeFruitRepository: jest.Mocked<TypeFruitRepositoryPort> = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFruitUseCase,
        { provide: FRUIT_REPOSITORY, useValue: mockFruitRepository },
        { provide: FAMILY_REPOSITORY, useValue: mockFamilyRepository },
        { provide: TYPE_FRUIT_REPOSITORY, useValue: mockTypeFruitRepository },
      ],
    }).compile();
    useCase = module.get<CreateFruitUseCase>(CreateFruitUseCase);
    fruitRepository = module.get(FRUIT_REPOSITORY);
    familyRepository = module.get(FAMILY_REPOSITORY);
    typeFruitRepository = module.get(TYPE_FRUIT_REPOSITORY);
  });

  it('should save a fruit with the correct relations', async () => {
    familyRepository.findById.mockResolvedValue(mockFamily);
    typeFruitRepository.findById.mockResolvedValue(mockTypeFruit);
    fruitRepository.findByScientificName.mockResolvedValue(null);
    fruitRepository.save.mockResolvedValue(expectedSavedFruit);
    const actualFruit: Fruit = await useCase.execute(inputCommand);
    expect(familyRepository.findById).toHaveBeenCalledWith(inputCommand.familyId);
    expect(typeFruitRepository.findById).toHaveBeenCalledWith(inputCommand.typeFruitId);
    expect(fruitRepository.findByScientificName).toHaveBeenCalledWith(inputCommand.scientificName);
    expect(fruitRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        commonName: inputCommand.commonName,
        scientificName: inputCommand.scientificName,
        description: inputCommand.description,
        familyId: inputCommand.familyId,
        typeFruitId: inputCommand.typeFruitId,
      }),
      {
        climateIds: inputCommand.climateIds,
        departmentIds: inputCommand.departmentIds,
        naturalRegionIds: inputCommand.naturalRegionIds,
        harvestSeasonIds: inputCommand.harvestSeasonIds,
      },
    );
    expect(actualFruit).toBe(expectedSavedFruit);
  });

  it('should throw FamilyNotFoundException when family does not exist', async () => {
    familyRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(inputCommand)).rejects.toThrow(FamilyNotFoundException);
    expect(fruitRepository.save).not.toHaveBeenCalled();
  });

  it('should throw TypeFruitNotFoundException when type fruit does not exist', async () => {
    familyRepository.findById.mockResolvedValue(mockFamily);
    typeFruitRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(inputCommand)).rejects.toThrow(TypeFruitNotFoundException);
    expect(fruitRepository.save).not.toHaveBeenCalled();
  });

  it('should throw DuplicateFruitScientificNameException when scientific name already exists', async () => {
    familyRepository.findById.mockResolvedValue(mockFamily);
    typeFruitRepository.findById.mockResolvedValue(mockTypeFruit);
    fruitRepository.findByScientificName.mockResolvedValue(expectedSavedFruit);
    await expect(useCase.execute(inputCommand)).rejects.toThrow(DuplicateFruitScientificNameException);
    expect(fruitRepository.save).not.toHaveBeenCalled();
  });
});
