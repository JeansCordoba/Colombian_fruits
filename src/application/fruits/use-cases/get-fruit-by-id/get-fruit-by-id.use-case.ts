import { Fruit } from "../../../../domain/fruits/entities/fruit.entity";
import { Inject, Injectable } from "@nestjs/common";
import { GetFruitByIdCommand } from "./get-fruit-by-id.command";

/**
 * Ports for the dependency injection.
 */
import { FruitRepositoryPort } from "../../../../domain/fruits/repositories/fruit.repository.port";

/**
 * Tokens for the dependency injection.
 */
import { FRUIT_REPOSITORY } from "../../../../domain/fruits/repositories/fruit.repository.token";

/**
 * Exceptions for the use case.
 */
import { FruitNotFoundException } from "../../../../domain/fruits/exceptions/fruit.exceptions";

@Injectable()
export class GetFruitByIdUseCase {
    constructor(
        @Inject(FRUIT_REPOSITORY)
        private readonly fruitRepository: FruitRepositoryPort,
    ) {}
    async execute(command: GetFruitByIdCommand): Promise<Fruit> {
        const fruit = await this.fruitRepository.findById(command.id);
        if (!fruit) {
            throw new FruitNotFoundException(command.id);
        }
        return fruit;
    }
}