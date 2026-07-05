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
import { CreateFruitCommand } from '../../../application/fruits/use-cases/create-fruit/create-fruit.command';
import { CreateFruitUseCase } from '../../../application/fruits/use-cases/create-fruit/create-fruit.use-case';
import { DeleteFruitCommand } from '../../../application/fruits/use-cases/delete-fruit/delete-fruit.command';
import { DeleteFruitUseCase } from '../../../application/fruits/use-cases/delete-fruit/delete-fruit.use-case';
import { GetFruitByIdCommand } from '../../../application/fruits/use-cases/get-fruit-by-id/get-fruit-by-id.command';
import { GetFruitByIdUseCase } from '../../../application/fruits/use-cases/get-fruit-by-id/get-fruit-by-id.use-case';
import { ListFruitsQuery } from '../../../application/fruits/use-cases/list-fruits/list-fruits.query';
import { ListFruitsUseCase } from '../../../application/fruits/use-cases/list-fruits/list-fruits.use-case';
import { UpdateFruitCommand } from '../../../application/fruits/use-cases/update-fruit/update-fruit.command';
import { UpdateFruitUseCase } from '../../../application/fruits/use-cases/update-fruit/update-fruit.use-case';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../application/shared/constants/pagination.constants';
import { ApiErrorResponseDto } from '../shared/dto/api-error.response.dto';
import { buildApiPaginatedSuccessResponse, buildApiSuccessResponse } from '../shared/http/build-api-success-response';
import { CreateFruitRequestDto } from './dto/create-fruit.request.dto';
import { FruitListResponseDto } from './dto/fruit-list.response.dto';
import { FruitDataResponseDto, FruitResponseDto, FruitSummaryResponseDto } from './dto/fruit.response.dto';
import { ListFruitsQueryDto } from './dto/list-fruits.query.dto';
import { UpdateFruitRequestDto } from './dto/update-fruit.request.dto';

@ApiTags('fruits')
@Controller('fruits')
export class FruitsController {
    constructor(
        private readonly createFruitUseCase: CreateFruitUseCase,
        private readonly getFruitByIdUseCase: GetFruitByIdUseCase,
        private readonly listFruitsUseCase: ListFruitsUseCase,
        private readonly updateFruitUseCase: UpdateFruitUseCase,
        private readonly deleteFruitUseCase: DeleteFruitUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a fruit with N:M relations' })
    @ApiCreatedResponse({ type: FruitDataResponseDto, description: 'Fruit created successfully' })
    @ApiBadRequestResponse({
        description: 'Invalid request body',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['commonName must not be empty'],
                error: 'Bad Request',
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'Foreign key not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Family with id 99 not found.',
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
                message: 'Invalid fruit data: common name must not be empty.',
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
    async create(@Body() requestDto: CreateFruitRequestDto): Promise<FruitDataResponseDto> {
        const command = new CreateFruitCommand(
            requestDto.commonName,
            requestDto.scientificName,
            requestDto.description ?? null,
            requestDto.familyId,
            requestDto.typeFruitId,
            requestDto.climateIds ?? [],
            requestDto.departmentIds ?? [],
            requestDto.naturalRegionIds ?? [],
            requestDto.harvestSeasonIds ?? [],
        );
        const savedFruit = await this.createFruitUseCase.execute(command);
        const fruitWithRelations = await this.getFruitByIdUseCase.execute(new GetFruitByIdCommand(savedFruit.id));
        return buildApiSuccessResponse(FruitResponseDto.fromReadModel(fruitWithRelations), HttpStatus.CREATED);
    }

    @Get()
    @ApiOperation({ summary: 'List fruits with pagination and optional search' })
    @ApiOkResponse({ type: FruitListResponseDto, description: 'Paginated list of fruits' })
    @ApiBadRequestResponse({
        description: 'Invalid query parameters',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['page must not be less than 1'],
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
    async list(@Query() queryDto: ListFruitsQueryDto): Promise<FruitListResponseDto> {
        const query = new ListFruitsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
            queryDto.search,
        );
        const result = await this.listFruitsUseCase.execute(query);
        return buildApiPaginatedSuccessResponse(
            result.data.map((item) => FruitSummaryResponseDto.fromListItem(item)),
            result.meta,
            HttpStatus.OK,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get fruit by id with nested relations' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Fruit numeric identifier' })
    @ApiOkResponse({ type: FruitDataResponseDto, description: 'Fruit found' })
    @ApiNotFoundResponse({
        description: 'Fruit not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Fruit with id 99 not found.',
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
    async getById(@Param('id', ParseIntPipe) id: number): Promise<FruitDataResponseDto> {
        const fruitWithRelations = await this.getFruitByIdUseCase.execute(new GetFruitByIdCommand(id));
        return buildApiSuccessResponse(FruitResponseDto.fromReadModel(fruitWithRelations), HttpStatus.OK);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a fruit and replace its N:M relations' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Fruit numeric identifier' })
    @ApiOkResponse({ type: FruitDataResponseDto, description: 'Fruit updated successfully' })
    @ApiBadRequestResponse({
        description: 'Invalid request body',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['scientificName must not be empty'],
                error: 'Bad Request',
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'Fruit or foreign key not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Fruit with id 99 not found.',
                error: 'Not Found',
            },
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Domain validation failed or scientific name conflict',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 409,
                message: 'Fruit with scientific name Passiflora ligularis already exists.',
                error: 'Conflict',
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
        @Body() requestDto: UpdateFruitRequestDto,
    ): Promise<FruitDataResponseDto> {
        const command = new UpdateFruitCommand(
            id,
            requestDto.commonName,
            requestDto.scientificName,
            requestDto.description ?? null,
            requestDto.familyId,
            requestDto.typeFruitId,
            requestDto.climateIds ?? [],
            requestDto.departmentIds ?? [],
            requestDto.naturalRegionIds ?? [],
            requestDto.harvestSeasonIds ?? [],
        );
        await this.updateFruitUseCase.execute(command);
        const fruitWithRelations = await this.getFruitByIdUseCase.execute(new GetFruitByIdCommand(id));
        return buildApiSuccessResponse(FruitResponseDto.fromReadModel(fruitWithRelations), HttpStatus.OK);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete a fruit' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Fruit numeric identifier' })
    @ApiNoContentResponse({
        description: 'Fruit soft-deleted successfully (record is hidden, not physically removed)',
    })
    @ApiNotFoundResponse({
        description: 'Fruit not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Fruit with id 99 not found.',
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
        await this.deleteFruitUseCase.execute(new DeleteFruitCommand(id));
    }
}
