import { Test, TestingModule } from '@nestjs/testing';
import { Family } from '../../../../domain/families/entities/family.entity';
import { FamilyNotFoundException } from '../../../../domain/families/exceptions/family.exceptions';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { DeleteFamilyCommand } from './delete-family.command';
import { DeleteFamilyUseCase } from './delete-family.use-case';

describe('DeleteFamilyUseCase', () => {
    let useCase: DeleteFamilyUseCase;
    let familyRepository: jest.Mocked<FamilyRepositoryPort>;

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
                DeleteFamilyUseCase,
                { provide: FAMILY_REPOSITORY, useValue: familyRepository },
            ],
        }).compile();
        useCase = module.get(DeleteFamilyUseCase);
    });

    it('should soft-delete family when it exists', async () => {
        familyRepository.findById.mockResolvedValue(
            new Family(1, 'Passifloraceae', 3, new Date('2026-01-01'), new Date('2026-01-01')),
        );
        await useCase.execute(new DeleteFamilyCommand(1));
        expect(familyRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw when family does not exist', async () => {
        familyRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new DeleteFamilyCommand(99))).rejects.toThrow(FamilyNotFoundException);
    });
});
