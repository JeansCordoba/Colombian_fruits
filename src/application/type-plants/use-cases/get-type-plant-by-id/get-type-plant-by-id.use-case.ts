import { Inject, Injectable } from '@nestjs/common';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantNotFoundException } from '../../../../domain/type-plants/exceptions/type-plant.exceptions';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { GetTypePlantByIdQuery } from './get-type-plant-by-id.query';

@Injectable()
export class GetTypePlantByIdUseCase {
    constructor(
        @Inject(TYPE_PLANT_REPOSITORY)
        private readonly typePlantRepository: TypePlantRepositoryPort,
    ) {}

    async execute(query: GetTypePlantByIdQuery): Promise<TypePlant> {
        const typePlant = await this.typePlantRepository.findById(query.id);
        if (!typePlant) {
            throw new TypePlantNotFoundException(query.id);
        }
        return typePlant;
    }
}
