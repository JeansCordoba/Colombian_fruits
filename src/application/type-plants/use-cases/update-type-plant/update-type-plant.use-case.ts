import { Inject, Injectable } from '@nestjs/common';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantNotFoundException } from '../../../../domain/type-plants/exceptions/type-plant.exceptions';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { UpdateTypePlantCommand } from './update-type-plant.command';

@Injectable()
export class UpdateTypePlantUseCase {
    constructor(
        @Inject(TYPE_PLANT_REPOSITORY)
        private readonly typePlantRepository: TypePlantRepositoryPort,
    ) {}

    async execute(command: UpdateTypePlantCommand): Promise<TypePlant> {
        const existingTypePlant = await this.typePlantRepository.findById(command.id);
        if (!existingTypePlant) {
            throw new TypePlantNotFoundException(command.id);
        }
        const updatedTypePlant = new TypePlant(
            existingTypePlant.id,
            command.name,
            existingTypePlant.createdAt,
            new Date(),
        );
        return this.typePlantRepository.update(updatedTypePlant);
    }
}
