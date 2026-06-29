import { Inject, Injectable } from '@nestjs/common';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { CreateTypeFruitCommand } from './create-type-fruit.command';

@Injectable()
export class CreateTypeFruitUseCase {
    constructor(
        @Inject(TYPE_FRUIT_REPOSITORY)
        private readonly typeFruitRepository: TypeFruitRepositoryPort,
    ) {}

    async execute(command: CreateTypeFruitCommand): Promise<TypeFruit> {
        const typeFruit = new TypeFruit(
            0,
            command.name,
            command.description,
            new Date(),
            new Date(),
        );
        return this.typeFruitRepository.save(typeFruit);
    }
}
