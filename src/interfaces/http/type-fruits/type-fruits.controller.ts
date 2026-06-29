import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { CreateTypeFruitCommand } from '../../../application/type-fruits/use-cases/create-type-fruits/create-type-fruit.command';
import { CreateTypeFruitUseCase } from '../../../application/type-fruits/use-cases/create-type-fruits/create-type-fruit.use-case';
import { DeleteTypeFruitCommand } from '../../../application/type-fruits/use-cases/delete-type-fruit/delete-type-fruit.command';
import { DeleteTypeFruitUseCase } from '../../../application/type-fruits/use-cases/delete-type-fruit/delete-type-fruit.use-case';
import { GetTypeFruitByIdQuery } from '../../../application/type-fruits/use-cases/get-type-fruit-by-id/get-type-fruit-by-id.query';
import { GetTypeFruitByIdUseCase } from '../../../application/type-fruits/use-cases/get-type-fruit-by-id/get-type-fruit-by-id.use-case';
import { ListTypeFruitsQuery } from '../../../application/type-fruits/use-cases/list-type-fruits/list-type-fruits.query';
import { ListTypeFruitsUseCase } from '../../../application/type-fruits/use-cases/list-type-fruits/list-type-fruits.use-case';
import { UpdateTypeFruitCommand } from '../../../application/type-fruits/use-cases/update-type-fruit/update-type-fruit.command';
import { UpdateTypeFruitUseCase } from '../../../application/type-fruits/use-cases/update-type-fruit/update-type-fruit.use-case';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../application/shared/constants/pagination.constants';
import { CreateTypeFruitRequestDto } from './dto/create-type-fruit.request.dto';
import { ListTypeFruitsQueryDto } from './dto/list-type-fruits.query.dto';
import { TypeFruitListResponseDto } from './dto/type-fruit-list.response.dto';
import { TypeFruitResponseDto } from './dto/type-fruit.response.dto';
import { UpdateTypeFruitRequestDto } from './dto/update-type-fruit.request.dto';

@ApiTags('type-fruits')
@Controller('type-fruits')
export class TypeFruitsController {
    constructor(
        private readonly createTypeFruitUseCase: CreateTypeFruitUseCase,
        private readonly getTypeFruitByIdUseCase: GetTypeFruitByIdUseCase,
        private readonly listTypeFruitsUseCase: ListTypeFruitsUseCase,
        private readonly updateTypeFruitUseCase: UpdateTypeFruitUseCase,
        private readonly deleteTypeFruitUseCase: DeleteTypeFruitUseCase,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a type fruit' })
    @ApiCreatedResponse({ description: 'Type fruit created' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    async create(@Body() requestDto: CreateTypeFruitRequestDto): Promise<TypeFruitResponseDto> {
        const command = new CreateTypeFruitCommand(
            requestDto.name,
            requestDto.description ?? null,
        );
        const typeFruit = await this.createTypeFruitUseCase.execute(command);
        return TypeFruitResponseDto.fromDomain(typeFruit);
    }

    @Get()
    @ApiOperation({ summary: 'List type fruits with pagination' })
    @ApiOkResponse({ type: TypeFruitListResponseDto })
    async list(@Query() queryDto: ListTypeFruitsQueryDto): Promise<TypeFruitListResponseDto> {
        const query = new ListTypeFruitsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listTypeFruitsUseCase.execute(query);
        return {
            data: result.data.map((typeFruit) => TypeFruitResponseDto.fromDomain(typeFruit)),
            meta: result.meta,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get type fruit by id' })
    @ApiOkResponse({ type: TypeFruitResponseDto })
    @ApiNotFoundResponse({ description: 'Type fruit not found' })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<TypeFruitResponseDto> {
        const typeFruit = await this.getTypeFruitByIdUseCase.execute(new GetTypeFruitByIdQuery(id));
        return TypeFruitResponseDto.fromDomain(typeFruit);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a type fruit' })
    @ApiOkResponse({ type: TypeFruitResponseDto })
    @ApiNotFoundResponse({ description: 'Type fruit not found' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() requestDto: UpdateTypeFruitRequestDto,
    ): Promise<TypeFruitResponseDto> {
        const command = new UpdateTypeFruitCommand(id, requestDto.name, requestDto.description);
        const typeFruit = await this.updateTypeFruitUseCase.execute(command);
        return TypeFruitResponseDto.fromDomain(typeFruit);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a type fruit' })
    @ApiNoContentResponse({ description: 'Type fruit deleted' })
    @ApiNotFoundResponse({ description: 'Type fruit not found' })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.deleteTypeFruitUseCase.execute(new DeleteTypeFruitCommand(id));
    }
}
