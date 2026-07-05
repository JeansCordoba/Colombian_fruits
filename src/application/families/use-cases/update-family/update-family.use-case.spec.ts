import { Test, TestingModule } from '@nestjs/testing';
import { Family } from '../../../../domain/families/entities/family.entity';
import {
    FamilyNotFoundException,
    InvalidFamilyDataException,
} from '../../../../domain/families/exceptions/family.exceptions';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { UpdateFamilyCommand } from './update-family.command';
import { UpdateFamilyUseCase } from './update-family.use-case';

describe('UpdateFamilyUseCase', () => {
    let useCase: UpdateFamilyUseCase;
    let familyRepository: jest.Mocked<FamilyRepositoryPort>;
    let typePlantRepository: jest.Mocked<TypePlantRepositoryPort>;

    const existingFamily: Family = new Family(
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
                UpdateFamilyUseCase,
                { provide: FAMILY_REPOSITORY, useValue: familyRepository },
                { provide: TYPE_PLANT_REPOSITORY, useValue: typePlantRepository },
            ],
        }).compile();
        useCase = module.get(UpdateFamilyUseCase);
    });

    it('should update family when it exists', async () => {
        typePlantRepository.findById.mockResolvedValue(
            new TypePlant(3, 'Vine', new Date('2026-01-01'), new Date('2026-01-01')),
        );
        familyRepository.findById.mockResolvedValue(existingFamily);
        familyRepository.update.mockResolvedValue(
            new Family(1, 'Malpighiaceae', 3, existingFamily.createdAt, new Date('2026-02-01')),
        );
        const result = await useCase.execute(new UpdateFamilyCommand(1, 'Malpighiaceae', 3));
        expect(result.family.name).toBe('Malpighiaceae');
    });

    it('should throw when family does not exist', async () => {
        familyRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new UpdateFamilyCommand(99, 'Test', 3))).rejects.toThrow(
            FamilyNotFoundException,
        );
    });

    it('should throw when name is empty', async () => {
        familyRepository.findById.mockResolvedValue(existingFamily);
        await expect(useCase.execute(new UpdateFamilyCommand(1, '   ', 3))).rejects.toThrow(
            InvalidFamilyDataException,
        );
    });
});
