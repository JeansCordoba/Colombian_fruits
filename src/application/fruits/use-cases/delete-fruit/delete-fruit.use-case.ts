import { Inject, Injectable } from '@nestjs/common';
import { FruitNotFoundException } from '../../../../domain/fruits/exceptions/fruit.exceptions';
import { FruitRepositoryPort } from '../../../../domain/fruits/repositories/fruit.repository.port';
import { FRUIT_REPOSITORY } from '../../../../domain/fruits/repositories/fruit.repository.token';
import { DeleteFruitCommand } from './delete-fruit.command';

@Injectable()
export class DeleteFruitUseCase {
    constructor(
        @Inject(FRUIT_REPOSITORY)
        private readonly fruitRepository: FruitRepositoryPort,
    ) {}

    async execute(command: DeleteFruitCommand): Promise<void> {
        const existingFruit = await this.fruitRepository.findById(command.id);
        if (!existingFruit) {
            throw new FruitNotFoundException(command.id);
        }
        await this.fruitRepository.softDelete(command.id);
    }
}
