import { Inject, Injectable } from '@nestjs/common';
import { FamilyNotFoundException } from '../../../../domain/families/exceptions/family.exceptions';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { DeleteFamilyCommand } from './delete-family.command';

@Injectable()
export class DeleteFamilyUseCase {
    constructor(
        @Inject(FAMILY_REPOSITORY)
        private readonly familyRepository: FamilyRepositoryPort,
    ) {}

    async execute(command: DeleteFamilyCommand): Promise<void> {
        const existingFamily = await this.familyRepository.findById(command.id);
        if (!existingFamily) {
            throw new FamilyNotFoundException(command.id);
        }
        await this.familyRepository.softDelete(command.id);
    }
}
