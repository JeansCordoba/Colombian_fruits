import { Inject, Injectable } from '@nestjs/common';
import { TypeFruitNotFoundException } from '../../../../domain/type-fruits/exceptions/type-fruit.exceptions';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { DeleteTypeFruitCommand } from './delete-type-fruit.command';

@Injectable()
export class DeleteTypeFruitUseCase {
    constructor(
        @Inject(TYPE_FRUIT_REPOSITORY)
        private readonly typeFruitRepository: TypeFruitRepositoryPort,
    ) {}

    async execute(command: DeleteTypeFruitCommand): Promise<void> {
        const existingTypeFruit = await this.typeFruitRepository.findById(command.id);
        if (!existingTypeFruit) {
            throw new TypeFruitNotFoundException(command.id);
        }
        await this.typeFruitRepository.softDelete(command.id);
    }
}
