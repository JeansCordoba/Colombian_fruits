import { Inject, Injectable } from '@nestjs/common';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';
import {
    InvalidNaturalRegionDataException,
    NaturalRegionNotFoundException,
} from '../../../../domain/natural-regions/exceptions/natural-region.exceptions';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { UpdateNaturalRegionCommand } from './update-natural-region.command';

const NATURAL_REGION_NAME_MAX_LENGTH = 100;

@Injectable()
export class UpdateNaturalRegionUseCase {
    constructor(
        @Inject(NATURAL_REGION_REPOSITORY)
        private readonly naturalRegionRepository: NaturalRegionRepositoryPort,
    ) {}

    async execute(command: UpdateNaturalRegionCommand): Promise<NaturalRegion> {
        const existingNaturalRegion = await this.naturalRegionRepository.findById(command.id);
        if (!existingNaturalRegion) {
            throw new NaturalRegionNotFoundException(command.id);
        }
        const name = command.name.trim();
        if (name.length === 0) {
            throw new InvalidNaturalRegionDataException('name must not be empty');
        }
        if (name.length > NATURAL_REGION_NAME_MAX_LENGTH) {
            throw new InvalidNaturalRegionDataException(`name must not exceed ${NATURAL_REGION_NAME_MAX_LENGTH} characters`);
        }
        const updatedNaturalRegion = new NaturalRegion(
            existingNaturalRegion.id,
            name,
            existingNaturalRegion.createdAt,
            new Date(),
        );
        return this.naturalRegionRepository.update(updatedNaturalRegion);
    }
}
