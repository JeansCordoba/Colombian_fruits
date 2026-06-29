import { Inject, Injectable } from '@nestjs/common';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';
import { InvalidNaturalRegionDataException } from '../../../../domain/natural-regions/exceptions/natural-region.exceptions';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { CreateNaturalRegionCommand } from './create-natural-region.command';

const NATURAL_REGION_NAME_MAX_LENGTH = 100;

@Injectable()
export class CreateNaturalRegionUseCase {
    constructor(
        @Inject(NATURAL_REGION_REPOSITORY)
        private readonly naturalRegionRepository: NaturalRegionRepositoryPort,
    ) {}

    async execute(command: CreateNaturalRegionCommand): Promise<NaturalRegion> {
        const name = command.name.trim();
        if (name.length === 0) {
            throw new InvalidNaturalRegionDataException('name must not be empty');
        }
        if (name.length > NATURAL_REGION_NAME_MAX_LENGTH) {
            throw new InvalidNaturalRegionDataException(`name must not exceed ${NATURAL_REGION_NAME_MAX_LENGTH} characters`);
        }
        const naturalRegion = new NaturalRegion(
            0,
            name,
            new Date(),
            new Date(),
        );
        return this.naturalRegionRepository.save(naturalRegion);
    }
}
