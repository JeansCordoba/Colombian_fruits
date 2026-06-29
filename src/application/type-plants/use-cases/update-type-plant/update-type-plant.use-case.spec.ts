import { Test, TestingModule } from '@nestjs/testing';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantNotFoundException } from '../../../../domain/type-plants/exceptions/type-plant.exceptions';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { UpdateTypePlantCommand } from './update-type-plant.command';
import { UpdateTypePlantUseCase } from './update-type-plant.use-case';

describe('UpdateTypePlantUseCase', () => {
    let useCase: UpdateTypePlantUseCase;
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
                UpdateTypePlantUseCase,
                { provide: TYPE_PLANT_REPOSITORY, useValue: typePlantRepository },
            ],
        }).compile();
        useCase = module.get(UpdateTypePlantUseCase);
    });

    it('should update type plant when it exists', async () => {
        const inputCommand = new UpdateTypePlantCommand(1, 'Arbol');
        typePlantRepository.findById.mockResolvedValue(existingTypePlant);
        typePlantRepository.update.mockResolvedValue(
            new TypePlant(1, 'Arbol', existingTypePlant.createdAt, new Date('2026-02-01')),
        );
        const actualTypePlant = await useCase.execute(inputCommand);
        expect(actualTypePlant.name).toBe('Arbol');
    });

    it('should throw when type plant does not exist', async () => {
        typePlantRepository.findById.mockResolvedValue(null);
        await expect(
            useCase.execute(new UpdateTypePlantCommand(99, 'Test')),
        ).rejects.toThrow(TypePlantNotFoundException);
    });
});
