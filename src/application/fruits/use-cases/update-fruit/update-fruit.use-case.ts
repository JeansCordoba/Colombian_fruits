import { Inject, Injectable } from '@nestjs/common';
import { FamilyNotFoundException } from '../../../../domain/families/exceptions/family.exceptions';
import { FamilyRepositoryPort } from '../../../../domain/families/repositories/family.repository.port';
import { FAMILY_REPOSITORY } from '../../../../domain/families/repositories/family.repository.token';
import { Fruit } from '../../../../domain/fruits/entities/fruit.entity';
import {
    DuplicateFruitScientificNameException,
    FruitNotFoundException,
} from '../../../../domain/fruits/exceptions/fruit.exceptions';
import { FruitRelations, FruitRepositoryPort } from '../../../../domain/fruits/repositories/fruit.repository.port';
import { FRUIT_REPOSITORY } from '../../../../domain/fruits/repositories/fruit.repository.token';
import { TypeFruitNotFoundException } from '../../../../domain/type-fruits/exceptions/type-fruit.exceptions';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { FruitRelationsValidator } from '../../services/fruit-relations.validator';
import { UpdateFruitCommand } from './update-fruit.command';

@Injectable()
export class UpdateFruitUseCase {
    constructor(
        @Inject(FRUIT_REPOSITORY)
        private readonly fruitRepository: FruitRepositoryPort,
        @Inject(FAMILY_REPOSITORY)
        private readonly familyRepository: FamilyRepositoryPort,
        @Inject(TYPE_FRUIT_REPOSITORY)
        private readonly typeFruitRepository: TypeFruitRepositoryPort,
        private readonly fruitRelationsValidator: FruitRelationsValidator,
    ) {}

    async execute(command: UpdateFruitCommand): Promise<Fruit> {
        const existingFruit = await this.fruitRepository.findById(command.id);
        if (!existingFruit) {
            throw new FruitNotFoundException(command.id);
        }
        const family = await this.familyRepository.findById(command.familyId);
        if (!family) {
            throw new FamilyNotFoundException(command.familyId);
        }
        const typeFruit = await this.typeFruitRepository.findById(command.typeFruitId);
        if (!typeFruit) {
            throw new TypeFruitNotFoundException(command.typeFruitId);
        }
        if (command.scientificName !== existingFruit.scientificName) {
            const fruitWithSameScientificName = await this.fruitRepository.findByScientificName(command.scientificName);
            if (fruitWithSameScientificName) {
                throw new DuplicateFruitScientificNameException(command.scientificName);
            }
        }
        const relations: FruitRelations = {
            climateIds: command.climateIds,
            departmentIds: command.departmentIds,
            naturalRegionIds: command.naturalRegionIds,
            harvestSeasonIds: command.harvestSeasonIds,
        };
        await this.fruitRelationsValidator.validate(relations);
        const updatedFruit = new Fruit(
            existingFruit.id,
            command.commonName,
            command.scientificName,
            command.description,
            command.familyId,
            command.typeFruitId,
            existingFruit.createdAt,
            new Date(),
        );
        return this.fruitRepository.update(updatedFruit, relations);
    }
}
