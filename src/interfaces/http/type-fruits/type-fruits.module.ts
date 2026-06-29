import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTypeFruitUseCase } from '../../../application/type-fruits/use-cases/create-type-fruits/create-type-fruit.use-case';
import { DeleteTypeFruitUseCase } from '../../../application/type-fruits/use-cases/delete-type-fruit/delete-type-fruit.use-case';
import { GetTypeFruitByIdUseCase } from '../../../application/type-fruits/use-cases/get-type-fruit-by-id/get-type-fruit-by-id.use-case';
import { ListTypeFruitsUseCase } from '../../../application/type-fruits/use-cases/list-type-fruits/list-type-fruits.use-case';
import { UpdateTypeFruitUseCase } from '../../../application/type-fruits/use-cases/update-type-fruit/update-type-fruit.use-case';
import { TYPE_FRUIT_REPOSITORY } from '../../../domain/type-fruits/repositories/type-fruit.repository.token';
import { TypeFruitOrmEntity } from '../../../infrastructure/persistence/type-fruits/type-fruit.orm-entity';
import { TypeFruitRepository } from '../../../infrastructure/persistence/type-fruits/type-fruit.repository';
import { TypeFruitsController } from './type-fruits.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TypeFruitOrmEntity])],
    controllers: [TypeFruitsController],
    providers: [
        CreateTypeFruitUseCase,
        GetTypeFruitByIdUseCase,
        ListTypeFruitsUseCase,
        UpdateTypeFruitUseCase,
        DeleteTypeFruitUseCase,
        {
            provide: TYPE_FRUIT_REPOSITORY,
            useClass: TypeFruitRepository,
        },
    ],
})
export class TypeFruitsModule {}
