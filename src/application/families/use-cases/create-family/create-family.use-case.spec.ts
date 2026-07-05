import { Test, TestingModule } from '@nestjs/testing';
import { Family } from '../../../../domain/families/entities/family.entity';
import { InvalidFamilyDataException } from '../../../../domain/families/exceptions/family.exceptions';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { CreateFamilyCommand } from './create-family.command';
import { CreateFamilyUseCase } from './create-family.use-case';

describe('CreateFamilyUseCase', () => {
    let useCase: CreateFamilyUseCase;
    let familyRepository: jest.Mocked<FamilyRepositoryPort>;
    let typePlantRepository: jest.Mocked<TypePlantRepositoryPort>;

    const mockTypePlant: TypePlant = new TypePlant(
        3,
        'Vine',
        new Date('2026-01-01'),
        new Date('2026-01-01'),
    );

    const savedFamily: Family = new Family(
        1,
        'Passifloraceae',
        3,
        new Date('2026-01-01'),
        new Date('2026-01-01'),
    );

    beforeEach(async () => {
        familyRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByIdWithTypePlant: jest.fn(),
            findByName: jest.fn(),
            findAll: jest.fn(),
            findPaginated: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
        };
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
                CreateFamilyUseCase,
                { provide: FAMILY_REPOSITORY, useValue: familyRepository },
                { provide: TYPE_PLANT_REPOSITORY, useValue: typePlantRepository },
            ],
        }).compile();
        useCase = module.get(CreateFamilyUseCase);
    });

    it('should create a family when data is valid', async () => {
        typePlantRepository.findById.mockResolvedValue(mockTypePlant);
        familyRepository.findByName.mockResolvedValue(null);
        familyRepository.save.mockResolvedValue(savedFamily);
        const result = await useCase.execute(new CreateFamilyCommand('Passifloraceae', 3));
        expect(result.family).toEqual(savedFamily);
        expect(result.typePlantName).toBe('Vine');
    });

    it('should throw when name is empty', async () => {
        await expect(useCase.execute(new CreateFamilyCommand('   ', 3))).rejects.toThrow(
            InvalidFamilyDataException,
        );
        expect(familyRepository.save).not.toHaveBeenCalled();
    });
});
