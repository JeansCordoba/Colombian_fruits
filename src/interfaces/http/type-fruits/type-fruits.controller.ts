import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnprocessableEntityResponse,
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
import { ApiErrorResponseDto } from '../shared/dto/api-error.response.dto';
import { buildApiPaginatedSuccessResponse, buildApiSuccessResponse } from '../shared/http/build-api-success-response';
import { CreateTypeFruitRequestDto } from './dto/create-type-fruit.request.dto';
import { ListTypeFruitsQueryDto } from './dto/list-type-fruits.query.dto';
import { TypeFruitListResponseDto } from './dto/type-fruit-list.response.dto';
import { TypeFruitDataResponseDto, TypeFruitResponseDto } from './dto/type-fruit.response.dto';
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
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a type fruit' })
    @ApiCreatedResponse({ type: TypeFruitDataResponseDto, description: 'Type fruit created successfully' })
    @ApiBadRequestResponse({
        description: 'Invalid request body',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['name must not be empty'],
                error: 'Bad Request',
            },
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Domain validation failed',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 422,
                message: 'Invalid type fruit data: name must not be empty.',
                error: 'Unprocessable Entity',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
                error: 'Internal Server Error',
            },
        },
    })
    async create(@Body() requestDto: CreateTypeFruitRequestDto): Promise<TypeFruitDataResponseDto> {
        const command = new CreateTypeFruitCommand(
            requestDto.name,
            requestDto.description ?? null,
        );
        const typeFruit = await this.createTypeFruitUseCase.execute(command);
        return buildApiSuccessResponse(TypeFruitResponseDto.fromDomain(typeFruit), HttpStatus.CREATED);
    }

    @Get()
    @ApiOperation({ summary: 'List type fruits with pagination' })
    @ApiOkResponse({ type: TypeFruitListResponseDto, description: 'Paginated list of type fruits' })
    @ApiBadRequestResponse({
        description: 'Invalid pagination query parameters',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['page must not be less than 1', 'limit must not be greater than 100'],
                error: 'Bad Request',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
                error: 'Internal Server Error',
            },
        },
    })
    async list(@Query() queryDto: ListTypeFruitsQueryDto): Promise<TypeFruitListResponseDto> {
        const query = new ListTypeFruitsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listTypeFruitsUseCase.execute(query);
        return buildApiPaginatedSuccessResponse(
            result.data.map((typeFruit) => TypeFruitResponseDto.fromDomain(typeFruit)),
            result.meta,
            HttpStatus.OK,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get type fruit by id' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Type fruit numeric identifier' })
    @ApiOkResponse({ type: TypeFruitDataResponseDto, description: 'Type fruit found' })
    @ApiNotFoundResponse({
        description: 'Type fruit not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Type fruit with id 99 not found.',
                error: 'Not Found',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
                error: 'Internal Server Error',
            },
        },
    })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<TypeFruitDataResponseDto> {
        const typeFruit = await this.getTypeFruitByIdUseCase.execute(new GetTypeFruitByIdQuery(id));
        return buildApiSuccessResponse(TypeFruitResponseDto.fromDomain(typeFruit), HttpStatus.OK);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a type fruit' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Type fruit numeric identifier' })
    @ApiOkResponse({ type: TypeFruitDataResponseDto, description: 'Type fruit updated successfully' })
    @ApiBadRequestResponse({
        description: 'Invalid request body',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['name must not be empty'],
                error: 'Bad Request',
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'Type fruit not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Type fruit with id 99 not found.',
                error: 'Not Found',
            },
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Domain validation failed',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 422,
                message: 'Invalid type fruit data: name must not be empty.',
                error: 'Unprocessable Entity',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
                error: 'Internal Server Error',
            },
        },
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() requestDto: UpdateTypeFruitRequestDto,
    ): Promise<TypeFruitDataResponseDto> {
        const command = new UpdateTypeFruitCommand(id, requestDto.name, requestDto.description);
        const typeFruit = await this.updateTypeFruitUseCase.execute(command);
        return buildApiSuccessResponse(TypeFruitResponseDto.fromDomain(typeFruit), HttpStatus.OK);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete a type fruit' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Type fruit numeric identifier' })
    @ApiNoContentResponse({
        description: 'Type fruit soft-deleted successfully (record is hidden, not physically removed)',
    })
    @ApiNotFoundResponse({
        description: 'Type fruit not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Type fruit with id 99 not found.',
                error: 'Not Found',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
                error: 'Internal Server Error',
            },
        },
    })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.deleteTypeFruitUseCase.execute(new DeleteTypeFruitCommand(id));
    }
}
