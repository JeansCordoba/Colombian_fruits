import { Inject, Injectable } from '@nestjs/common';
import { TypePlant } from '../../../../domain/type-plants/entities/type-plant.entity';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { CreateTypePlantCommand } from './create-type-plant.command';

@Injectable()
export class CreateTypePlantUseCase {
    constructor(
        @Inject(TYPE_PLANT_REPOSITORY)
        private readonly typePlantRepository: TypePlantRepositoryPort,
    ) {}

    async execute(command: CreateTypePlantCommand): Promise<TypePlant> {
        const typePlant = new TypePlant(
            0,
            command.name,
            new Date(),
            new Date(),
        );
        return this.typePlantRepository.save(typePlant);
    }
}
