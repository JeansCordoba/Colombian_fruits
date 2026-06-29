import { Test, TestingModule } from '@nestjs/testing';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantNotFoundException } from '../../../../domain/type-plants/exceptions/type-plant.exceptions';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { DeleteTypePlantCommand } from './delete-type-plant.command';
import { DeleteTypePlantUseCase } from './delete-type-plant.use-case';

describe('DeleteTypePlantUseCase', () => {
    let useCase: DeleteTypePlantUseCase;
    let typePlantRepository: jest.Mocked<TypePlantRepositoryPort>;

    const existingTypePlant: TypePlant = new TypePlant(
        1,
        'Arbusto',
        new Date('2026-01-01'),
        new Date('2026-01-01'),
    );

    beforeEach(async () => {
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
                DeleteTypePlantUseCase,
                { provide: TYPE_PLANT_REPOSITORY, useValue: typePlantRepository },
            ],
        }).compile();
        useCase = module.get(DeleteTypePlantUseCase);
    });

    it('should soft-delete type plant when it exists', async () => {
        typePlantRepository.findById.mockResolvedValue(existingTypePlant);
        typePlantRepository.softDelete.mockResolvedValue(undefined);
        await useCase.execute(new DeleteTypePlantCommand(1));
        expect(typePlantRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw when type plant does not exist', async () => {
        typePlantRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new DeleteTypePlantCommand(99))).rejects.toThrow(
            TypePlantNotFoundException,
        );
        expect(typePlantRepository.softDelete).not.toHaveBeenCalled();
    });
});
