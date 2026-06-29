import { Inject, Injectable } from '@nestjs/common';
import { Climate } from '../../../../domain/climates/entities/climate.entity';
import { ClimateNotFoundException } from '../../../../domain/climates/exceptions/climate.exceptions';
import { ClimateRepositoryPort } from '../../../../domain/climates/repositories/climate.repository.port';
import { CLIMATE_REPOSITORY } from '../../../../domain/climates/repositories/climate.repository.token';
import { GetClimateByIdQuery } from './get-climate-by-id.query';

@Injectable()
export class GetClimateByIdUseCase {
    constructor(
        @Inject(CLIMATE_REPOSITORY)
        private readonly climateRepository: ClimateRepositoryPort,
    ) {}

    async execute(query: GetClimateByIdQuery): Promise<Climate> {
        const climate = await this.climateRepository.findById(query.id);
        if (!climate) {
            throw new ClimateNotFoundException(query.id);
        }
        return climate;
    }
}
