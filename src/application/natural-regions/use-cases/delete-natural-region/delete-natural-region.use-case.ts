import { Inject, Injectable } from '@nestjs/common';
import { NaturalRegionNotFoundException } from '../../../../domain/natural-regions/exceptions/natural-region.exceptions';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { DeleteNaturalRegionCommand } from './delete-natural-region.command';

@Injectable()
export class DeleteNaturalRegionUseCase {
    constructor(
        @Inject(NATURAL_REGION_REPOSITORY)
        private readonly naturalRegionRepository: NaturalRegionRepositoryPort,
    ) {}

    async execute(command: DeleteNaturalRegionCommand): Promise<void> {
        const existingNaturalRegion = await this.naturalRegionRepository.findById(command.id);
        if (!existingNaturalRegion) {
            throw new NaturalRegionNotFoundException(command.id);
        }
        await this.naturalRegionRepository.softDelete(command.id);
    }
}
