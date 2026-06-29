import { Inject, Injectable } from '@nestjs/common';
import { Climate } from '../../../../domain/climates/entities/climate.entity';
import { InvalidClimateDataException } from '../../../../domain/climates/exceptions/climate.exceptions';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { CreateClimateCommand } from './create-climate.command';

const CLIMATE_NAME_MAX_LENGTH = 50;

@Injectable()
export class CreateClimateUseCase {
    constructor(
        @Inject(CLIMATE_REPOSITORY)
        private readonly climateRepository: ClimateRepositoryPort,
    ) {}

    async execute(command: CreateClimateCommand): Promise<Climate> {
        const name = command.name.trim();
        if (name.length === 0) {
            throw new InvalidClimateDataException('name must not be empty');
        }
        if (name.length > CLIMATE_NAME_MAX_LENGTH) {
            throw new InvalidClimateDataException(`name must not exceed ${CLIMATE_NAME_MAX_LENGTH} characters`);
        }
        const climate = new Climate(
            0,
            name,
            new Date(),
            new Date(),
        );
        return this.climateRepository.save(climate);
    }
}
