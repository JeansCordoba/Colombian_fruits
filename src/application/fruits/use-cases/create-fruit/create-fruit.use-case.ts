import { Fruit } from "../../../../domain/fruits/entities/fruit.entity";
import { Inject, Injectable } from "@nestjs/common";
import { CreateFruitCommand } from "./create-fruit.command";

/**
 * Ports for the dependency injection.
 */
import { FruitRelations, FruitRepositoryPort } from "../../../../domain/fruits/repositories/fruit.repository.port";
import { FamilyRepositoryPort } from "../../../../domain/families/repositories/family.repository.port";
import { TypeFruitRepositoryPort } from "../../../../domain/type-fruits/repositories/type-fruit.repository.port";

/**
 * Tokens for the dependency injection.
 */
import { FRUIT_REPOSITORY } from "../../../../domain/fruits/repositories/fruit.repository.token";
import { FAMILY_REPOSITORY } from "../../../../domain/families/repositories/family.repository.token";
import { TYPE_FRUIT_REPOSITORY } from "../../../../domain/type-fruits/repositories/type-fruit.repository.token";

/**
 * Exceptions for the use case.
 */
import { FamilyNotFoundException } from "../../../../domain/families/exceptions/family.exceptions";
import { TypeFruitNotFoundException } from "../../../../domain/type-fruits/exceptions/type-fruit.exceptions";
import { DuplicateFruitScientificNameException } from "../../../../domain/fruits/exceptions/fruit.exceptions";

@Injectable()
export class CreateFruitUseCase {
    constructor(
        @Inject(FRUIT_REPOSITORY)
        private readonly fruitRepository: FruitRepositoryPort,
        @Inject(FAMILY_REPOSITORY)
        private readonly familyRepository: FamilyRepositoryPort,
        @Inject(TYPE_FRUIT_REPOSITORY)
        private readonly typeFruitRepository: TypeFruitRepositoryPort,
    ) {}
    async execute(command: CreateFruitCommand): Promise<Fruit>{
        const family = await this.familyRepository.findById(command.familyId);
        if (!family) {
            throw new FamilyNotFoundException(command.familyId);
        }

        const typeFruit = await this.typeFruitRepository.findById(command.typeFruitId);
        if (!typeFruit) {
            throw new TypeFruitNotFoundException(command.typeFruitId);
        }

        const scientificNameAlreadyExists = await this.fruitRepository.findByScientificName(command.scientificName);
        if (scientificNameAlreadyExists) {
            throw new DuplicateFruitScientificNameException(command.scientificName);
        }

        const fruit = new Fruit(
            0,
            command.commonName,
            command.scientificName,
            command.description,
            command.familyId,
            command.typeFruitId,
            new Date(),
            new Date(),
        );
        const relations: FruitRelations = {
            climateIds: command.climateIds,
            departmentIds: command.departmentIds,
            naturalRegionIds: command.naturalRegionIds,
            harvestSeasonIds: command.harvestSeasonIds,
        };
        return this.fruitRepository.save(fruit, relations);
    }
}