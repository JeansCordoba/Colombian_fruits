import { Inject, Injectable } from '@nestjs/common';
import { Climate } from '../../../../domain/climates/entities/climate.entity';
import {
    ClimateNotFoundException,
    InvalidClimateDataException,
} from '../../../../domain/climates/exceptions/climate.exceptions';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { UpdateClimateCommand } from './update-climate.command';

const CLIMATE_NAME_MAX_LENGTH = 50;

@Injectable()
export class UpdateClimateUseCase {
    constructor(
        @Inject(CLIMATE_REPOSITORY)
        private readonly climateRepository: ClimateRepositoryPort,
    ) {}

    async execute(command: UpdateClimateCommand): Promise<Climate> {
        const existingClimate = await this.climateRepository.findById(command.id);
        if (!existingClimate) {
            throw new ClimateNotFoundException(command.id);
        }
        const name = command.name.trim();
        if (name.length === 0) {
            throw new InvalidClimateDataException('name must not be empty');
        }
        if (name.length > CLIMATE_NAME_MAX_LENGTH) {
            throw new InvalidClimateDataException(`name must not exceed ${CLIMATE_NAME_MAX_LENGTH} characters`);
        }
        const updatedClimate = new Climate(
            existingClimate.id,
            name,
            existingClimate.createdAt,
            new Date(),
        );
        return this.climateRepository.update(updatedClimate);
    }
}
