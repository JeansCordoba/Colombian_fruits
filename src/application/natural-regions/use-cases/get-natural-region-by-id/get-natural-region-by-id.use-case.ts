import { Inject, Injectable } from '@nestjs/common';
import { NaturalRegion } from '../../../../domain/natural-regions/entities/natural-region.entity';
import { NaturalRegionNotFoundException } from '../../../../domain/natural-regions/exceptions/natural-region.exceptions';
import { NaturalRegionRepositoryPort } from '../../../../domain/natural-regions/repositories/natural-region.repository.port';
import { NATURAL_REGION_REPOSITORY } from '../../../../domain/natural-regions/repositories/natural-region.repository.token';
import { GetNaturalRegionByIdQuery } from './get-natural-region-by-id.query';

@Injectable()
export class GetNaturalRegionByIdUseCase {
    constructor(
        @Inject(NATURAL_REGION_REPOSITORY)
        private readonly naturalRegionRepository: NaturalRegionRepositoryPort,
    ) {}

    async execute(query: GetNaturalRegionByIdQuery): Promise<NaturalRegion> {
        const naturalRegion = await this.naturalRegionRepository.findById(query.id);
        if (!naturalRegion) {
            throw new NaturalRegionNotFoundException(query.id);
        }
        return naturalRegion;
    }
}
