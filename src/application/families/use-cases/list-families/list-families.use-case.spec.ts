import { Test, TestingModule } from '@nestjs/testing';
import { Family } from '../../../../domain/families/entities/family.entity';
import { FamilyWithTypePlant } from '../../../../domain/families/entities/family-with-type-plant';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { ListFamiliesQuery } from './list-families.query';
import { ListFamiliesUseCase } from './list-families.use-case';

describe('ListFamiliesUseCase', () => {
    let useCase: ListFamiliesUseCase;
    let familyRepository: jest.Mocked<FamilyRepositoryPort>;

    const mockFamilies: FamilyWithTypePlant[] = [
        {
            family: new Family(1, 'Passifloraceae', 3, new Date('2026-01-01'), new Date('2026-01-01')),
            typePlantName: 'Vine',
        },
    ];

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
                ListFamiliesUseCase,
                { provide: FAMILY_REPOSITORY, useValue: familyRepository },
            ],
        }).compile();
        useCase = module.get(ListFamiliesUseCase);
    });

    it('should return paginated families', async () => {
        familyRepository.findPaginated.mockResolvedValue(mockFamilies);
        familyRepository.count.mockResolvedValue(1);
        const result = await useCase.execute(new ListFamiliesQuery(1, 20));
        expect(result.data).toEqual(mockFamilies);
        expect(result.meta.total).toBe(1);
    });
});
