import { Inject, Injectable } from '@nestjs/common';
import { ClimateNotFoundException } from '../../../../domain/climates/exceptions/climate.exceptions';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { DeleteClimateCommand } from './delete-climate.command';

@Injectable()
export class DeleteClimateUseCase {
    constructor(
        @Inject(CLIMATE_REPOSITORY)
        private readonly climateRepository: ClimateRepositoryPort,
    ) {}

    async execute(command: DeleteClimateCommand): Promise<void> {
        const existingClimate = await this.climateRepository.findById(command.id);
        if (!existingClimate) {
            throw new ClimateNotFoundException(command.id);
        }
        await this.climateRepository.softDelete(command.id);
    }
}
