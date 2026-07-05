import { Inject, Injectable } from '@nestjs/common';
import { Family } from '../../../../domain/families/entities/family.entity';
import { FamilyWithTypePlant } from '../../../../domain/families/entities/family-with-type-plant';
import {
    DuplicateFamilyNameException,
    FamilyNotFoundException,
    InvalidFamilyDataException,
} from '../../../../domain/families/exceptions/family.exceptions';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { TypePlantNotFoundException } from '../../../../domain/type-plants/exceptions/type-plant.exceptions';
import { TypePlantRepositoryPort } from '../../../../domain/type-plants/repositories/type-plant.repository.port';
import { TYPE_PLANT_REPOSITORY } from '../../../../domain/type-plants/repositories/type-plant.repository.token';
import { UpdateFamilyCommand } from './update-family.command';

const FAMILY_NAME_MAX_LENGTH = 50;

@Injectable()
export class UpdateFamilyUseCase {
    constructor(
        @Inject(FAMILY_REPOSITORY)
        private readonly familyRepository: FamilyRepositoryPort,
        @Inject(TYPE_PLANT_REPOSITORY)
        private readonly typePlantRepository: TypePlantRepositoryPort,
    ) {}

    async execute(command: UpdateFamilyCommand): Promise<FamilyWithTypePlant> {
        const existingFamily = await this.familyRepository.findById(command.id);
        if (!existingFamily) {
            throw new FamilyNotFoundException(command.id);
        }
        const name = command.name.trim();
        if (name.length === 0) {
            throw new InvalidFamilyDataException('name must not be empty');
        }
        if (name.length > FAMILY_NAME_MAX_LENGTH) {
            throw new InvalidFamilyDataException(`name must not exceed ${FAMILY_NAME_MAX_LENGTH} characters`);
        }
        const typePlant = await this.typePlantRepository.findById(command.typePlantId);
        if (!typePlant) {
            throw new TypePlantNotFoundException(command.typePlantId);
        }
        if (name !== existingFamily.name) {
            const familyWithSameName = await this.familyRepository.findByName(name);
            if (familyWithSameName) {
                throw new DuplicateFamilyNameException(name);
            }
        }
        const updatedFamily = new Family(
            existingFamily.id,
            name,
            typePlant.id,
            existingFamily.createdAt,
            new Date(),
        );
        const savedFamily = await this.familyRepository.update(updatedFamily);
        return { family: savedFamily, typePlantName: typePlant.name };
    }
}
