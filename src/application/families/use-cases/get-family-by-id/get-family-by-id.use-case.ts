import { Inject, Injectable } from '@nestjs/common';
import { FamilyWithTypePlant } from '../../../../domain/families/entities/family-with-type-plant';
import { FamilyNotFoundException } from '../../../../domain/families/exceptions/family.exceptions';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { GetFamilyByIdQuery } from './get-family-by-id.query';

@Injectable()
export class GetFamilyByIdUseCase {
    constructor(
        @Inject(FAMILY_REPOSITORY)
        private readonly familyRepository: FamilyRepositoryPort,
    ) {}

    async execute(query: GetFamilyByIdQuery): Promise<FamilyWithTypePlant> {
        const familyWithTypePlant = await this.familyRepository.findByIdWithTypePlant(query.id);
        if (!familyWithTypePlant) {
            throw new FamilyNotFoundException(query.id);
        }
        return familyWithTypePlant;
    }
}
