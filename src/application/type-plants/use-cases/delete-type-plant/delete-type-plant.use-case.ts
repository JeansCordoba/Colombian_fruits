import { Inject, Injectable } from '@nestjs/common';
import { TypePlantNotFoundException } from '../../../../domain/type-plants/exceptions/type-plant.exceptions';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { DeleteTypePlantCommand } from './delete-type-plant.command';

@Injectable()
export class DeleteTypePlantUseCase {
    constructor(
        @Inject(TYPE_PLANT_REPOSITORY)
        private readonly typePlantRepository: TypePlantRepositoryPort,
    ) {}

    async execute(command: DeleteTypePlantCommand): Promise<void> {
        const existingTypePlant = await this.typePlantRepository.findById(command.id);
        if (!existingTypePlant) {
            throw new TypePlantNotFoundException(command.id);
        }
        await this.typePlantRepository.softDelete(command.id);
    }
}
