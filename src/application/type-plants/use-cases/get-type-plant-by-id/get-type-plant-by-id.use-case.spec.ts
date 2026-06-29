import { Test, TestingModule } from '@nestjs/testing';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantNotFoundException } from '../../../../domain/type-plants/exceptions/type-plant.exceptions';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { GetTypePlantByIdQuery } from './get-type-plant-by-id.query';
import { GetTypePlantByIdUseCase } from './get-type-plant-by-id.use-case';

describe('GetTypePlantByIdUseCase', () => {
    let useCase: GetTypePlantByIdUseCase;
    let typePlantRepository: jest.Mocked<TypePlantRepositoryPort>;

    const typePlant: TypePlant = new TypePlant(
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
                GetTypePlantByIdUseCase,
                { provide: TYPE_PLANT_REPOSITORY, useValue: typePlantRepository },
            ],
        }).compile();
        useCase = module.get(GetTypePlantByIdUseCase);
    });

    it('should return type plant when it exists', async () => {
        typePlantRepository.findById.mockResolvedValue(typePlant);
        const actualTypePlant = await useCase.execute(new GetTypePlantByIdQuery(1));
        expect(actualTypePlant).toEqual(typePlant);
    });

    it('should throw when type plant does not exist', async () => {
        typePlantRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute(new GetTypePlantByIdQuery(99))).rejects.toThrow(
            TypePlantNotFoundException,
        );
    });
});
