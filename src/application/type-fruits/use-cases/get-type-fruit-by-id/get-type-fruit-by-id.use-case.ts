import { Inject, Injectable } from '@nestjs/common';
import { TypeFruit } from '../../../../domain/type-fruits/entities/type-fruit.entity';
import { TypeFruitNotFoundException } from '../../../../domain/type-fruits/exceptions/type-fruit.exceptions';
import { TypeFruitRepositoryPort } from '../../../../domain/type-fruits/repositories/type-fruit.repository.port';
import { TYPE_FRUIT_REPOSITORY } from '../../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { GetTypeFruitByIdQuery } from './get-type-fruit-by-id.query';

@Injectable()
export class GetTypeFruitByIdUseCase {
    constructor(
        @Inject(TYPE_FRUIT_REPOSITORY)
        private readonly typeFruitRepository: TypeFruitRepositoryPort,
    ) {}

    async execute(query: GetTypeFruitByIdQuery): Promise<TypeFruit> {
        const typeFruit = await this.typeFruitRepository.findById(query.id);
        if (!typeFruit) {
            throw new TypeFruitNotFoundException(query.id);
        }
        return typeFruit;
    }
}
