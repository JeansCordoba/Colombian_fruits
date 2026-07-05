import { Test, TestingModule } from '@nestjs/testing';
import { Family } from '../../../../domain/families/entities/family.entity';
import { FamilyWithTypePlant } from '../../../../domain/families/entities/family-with-type-plant';
import { FamilyNotFoundException } from '../../../../domain/families/exceptions/family.exceptions';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { GetFamilyByIdQuery } from './get-family-by-id.query';
import { GetFamilyByIdUseCase } from './get-family-by-id.use-case';

describe('GetFamilyByIdUseCase', () => {
    let useCase: GetFamilyByIdUseCase;
    let familyRepository: jest.Mocked<FamilyRepositoryPort>;

    const mockFamilyWithTypePlant: FamilyWithTypePlant = {
        family: new Family(1, 'Passifloraceae', 3, new Date('2026-01-01'), new Date('2026-01-01')),
        typePlantName: 'Vine',
    };

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
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetFamilyByIdUseCase,
                { provide: FAMILY_REPOSITORY, useValue: familyRepository },
            ],
        }).compile();
        useCase = module.get(GetFamilyByIdUseCase);
    });

    it('should return family when it exists', async () => {
        familyRepository.findByIdWithTypePlant.mockResolvedValue(mockFamilyWithTypePlant);
        const result = await useCase.execute(new GetFamilyByIdQuery(1));
        expect(result).toBe(mockFamilyWithTypePlant);
    });

    it('should throw when family does not exist', async () => {
        familyRepository.findByIdWithTypePlant.mockResolvedValue(null);
        await expect(useCase.execute(new GetFamilyByIdQuery(99))).rejects.toThrow(FamilyNotFoundException);
    });
});
