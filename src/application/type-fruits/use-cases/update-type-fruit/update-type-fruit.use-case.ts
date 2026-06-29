import { Inject, Injectable } from '@nestjs/common';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitNotFoundException } from '../../../../domain/type-fruits/exceptions/type-fruit.exceptions';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { UpdateTypeFruitCommand } from './update-type-fruit.command';

@Injectable()
export class UpdateTypeFruitUseCase {
    constructor(
        @Inject(TYPE_FRUIT_REPOSITORY)
        private readonly typeFruitRepository: TypeFruitRepositoryPort,
    ) {}

    async execute(command: UpdateTypeFruitCommand): Promise<TypeFruit> {
        const existingTypeFruit = await this.typeFruitRepository.findById(command.id);
        if (!existingTypeFruit) {
            throw new TypeFruitNotFoundException(command.id);
        }
        const description =
            command.description !== undefined ? command.description : existingTypeFruit.description;
        const updatedTypeFruit = new TypeFruit(
            existingTypeFruit.id,
            command.name,
            description,
            existingTypeFruit.createdAt,
            new Date(),
        );
        return this.typeFruitRepository.update(updatedTypeFruit);
    }
}
