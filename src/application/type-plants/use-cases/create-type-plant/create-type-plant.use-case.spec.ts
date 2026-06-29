import { Test, TestingModule } from '@nestjs/testing';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { CreateTypePlantCommand } from './create-type-plant.command';
import { CreateTypePlantUseCase } from './create-type-plant.use-case';

describe('CreateTypePlantUseCase', () => {
    let useCase: CreateTypePlantUseCase;
    let typePlantRepository: jest.Mocked<TypePlantRepositoryPort>;

    const inputCommand: CreateTypePlantCommand = new CreateTypePlantCommand('Arbusto');
    const savedTypePlant: TypePlant = new TypePlant(
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
                CreateTypePlantUseCase,
                { provide: TYPE_PLANT_REPOSITORY, useValue: typePlantRepository },
            ],
        }).compile();
        useCase = module.get(CreateTypePlantUseCase);
    });

    it('should create a type plant', async () => {
        typePlantRepository.save.mockResolvedValue(savedTypePlant);
        const actualTypePlant = await useCase.execute(inputCommand);
        expect(actualTypePlant).toEqual(savedTypePlant);
        expect(typePlantRepository.save).toHaveBeenCalled();
    });
});
