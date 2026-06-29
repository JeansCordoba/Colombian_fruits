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
import { CreateTypePlantCommand } from '../../../application/type-plants/use-cases/create-type-plant/create-type-plant.command';
import { CreateTypePlantUseCase } from '../../../application/type-plants/use-cases/create-type-plant/create-type-plant.use-case';
import { DeleteTypePlantCommand } from '../../../application/type-plants/use-cases/delete-type-plant/delete-type-plant.command';
import { DeleteTypePlantUseCase } from '../../../application/type-plants/use-cases/delete-type-plant/delete-type-plant.use-case';
import { GetTypePlantByIdQuery } from '../../../application/type-plants/use-cases/get-type-plant-by-id/get-type-plant-by-id.query';
import { GetTypePlantByIdUseCase } from '../../../application/type-plants/use-cases/get-type-plant-by-id/get-type-plant-by-id.use-case';
import { ListTypePlantsQuery } from '../../../application/type-plants/use-cases/list-type-plants/list-type-plants.query';
import { ListTypePlantsUseCase } from '../../../application/type-plants/use-cases/list-type-plants/list-type-plants.use-case';
import { UpdateTypePlantCommand } from '../../../application/type-plants/use-cases/update-type-plant/update-type-plant.command';
import { UpdateTypePlantUseCase } from '../../../application/type-plants/use-cases/update-type-plant/update-type-plant.use-case';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../application/shared/constants/pagination.constants';
import { ApiErrorResponseDto } from '../shared/dto/api-error.response.dto';
import { buildApiPaginatedSuccessResponse, buildApiSuccessResponse } from '../shared/http/build-api-success-response';
import { CreateTypePlantRequestDto } from './dto/create-type-plant.request.dto';
import { ListTypePlantsQueryDto } from './dto/list-type-plants.query.dto';
import { TypePlantListResponseDto } from './dto/type-plant-list.response.dto';
import { TypePlantDataResponseDto, TypePlantResponseDto } from './dto/type-plant.response.dto';
import { UpdateTypePlantRequestDto } from './dto/update-type-plant.request.dto';

@ApiTags('type-plants')
@Controller('type-plants')
export class TypePlantsController {
    constructor(
        private readonly createTypePlantUseCase: CreateTypePlantUseCase,
        private readonly getTypePlantByIdUseCase: GetTypePlantByIdUseCase,
        private readonly listTypePlantsUseCase: ListTypePlantsUseCase,
        private readonly updateTypePlantUseCase: UpdateTypePlantUseCase,
        private readonly deleteTypePlantUseCase: DeleteTypePlantUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a type plant' })
    @ApiCreatedResponse({ type: TypePlantDataResponseDto, description: 'Type plant created successfully' })
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
                message: 'Invalid type plant data: name must not be empty.',
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
    async create(@Body() requestDto: CreateTypePlantRequestDto): Promise<TypePlantDataResponseDto> {
        const command = new CreateTypePlantCommand(requestDto.name);
        const typePlant = await this.createTypePlantUseCase.execute(command);
        return buildApiSuccessResponse(TypePlantResponseDto.fromDomain(typePlant), HttpStatus.CREATED);
    }

    @Get()
    @ApiOperation({ summary: 'List type plants with pagination' })
    @ApiOkResponse({ type: TypePlantListResponseDto, description: 'Paginated list of type plants' })
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
    async list(@Query() queryDto: ListTypePlantsQueryDto): Promise<TypePlantListResponseDto> {
        const query = new ListTypePlantsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listTypePlantsUseCase.execute(query);
        return buildApiPaginatedSuccessResponse(
            result.data.map((typePlant) => TypePlantResponseDto.fromDomain(typePlant)),
            result.meta,
            HttpStatus.OK,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get type plant by id' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Type plant numeric identifier' })
    @ApiOkResponse({ type: TypePlantDataResponseDto, description: 'Type plant found' })
    @ApiNotFoundResponse({
        description: 'Type plant not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Type plant with id 99 not found.',
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
    async getById(@Param('id', ParseIntPipe) id: number): Promise<TypePlantDataResponseDto> {
        const typePlant = await this.getTypePlantByIdUseCase.execute(new GetTypePlantByIdQuery(id));
        return buildApiSuccessResponse(TypePlantResponseDto.fromDomain(typePlant), HttpStatus.OK);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a type plant' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Type plant numeric identifier' })
    @ApiOkResponse({ type: TypePlantDataResponseDto, description: 'Type plant updated successfully' })
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
        description: 'Type plant not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Type plant with id 99 not found.',
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
                message: 'Invalid type plant data: name must not be empty.',
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
        @Body() requestDto: UpdateTypePlantRequestDto,
    ): Promise<TypePlantDataResponseDto> {
        const command = new UpdateTypePlantCommand(id, requestDto.name);
        const typePlant = await this.updateTypePlantUseCase.execute(command);
        return buildApiSuccessResponse(TypePlantResponseDto.fromDomain(typePlant), HttpStatus.OK);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete a type plant' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Type plant numeric identifier' })
    @ApiNoContentResponse({
        description: 'Type plant soft-deleted successfully (record is hidden, not physically removed)',
    })
    @ApiNotFoundResponse({
        description: 'Type plant not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Type plant with id 99 not found.',
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
        await this.deleteTypePlantUseCase.execute(new DeleteTypePlantCommand(id));
    }
}
