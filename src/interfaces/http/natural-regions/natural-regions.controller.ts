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
import { CreateNaturalRegionCommand } from '../../../application/natural-regions/use-cases/create-natural-region/create-natural-region.command';
import { CreateNaturalRegionUseCase } from '../../../application/natural-regions/use-cases/create-natural-region/create-natural-region.use-case';
import { DeleteNaturalRegionCommand } from '../../../application/natural-regions/use-cases/delete-natural-region/delete-natural-region.command';
import { DeleteNaturalRegionUseCase } from '../../../application/natural-regions/use-cases/delete-natural-region/delete-natural-region.use-case';
import { GetNaturalRegionByIdQuery } from '../../../application/natural-regions/use-cases/get-natural-region-by-id/get-natural-region-by-id.query';
import { GetNaturalRegionByIdUseCase } from '../../../application/natural-regions/use-cases/get-natural-region-by-id/get-natural-region-by-id.use-case';
import { ListNaturalRegionsQuery } from '../../../application/natural-regions/use-cases/list-natural-regions/list-natural-regions.query';
import { ListNaturalRegionsUseCase } from '../../../application/natural-regions/use-cases/list-natural-regions/list-natural-regions.use-case';
import { UpdateNaturalRegionCommand } from '../../../application/natural-regions/use-cases/update-natural-region/update-natural-region.command';
import { UpdateNaturalRegionUseCase } from '../../../application/natural-regions/use-cases/update-natural-region/update-natural-region.use-case';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../application/shared/constants/pagination.constants';
import { ApiErrorResponseDto } from '../shared/dto/api-error.response.dto';
import { buildApiPaginatedSuccessResponse, buildApiSuccessResponse } from '../shared/http/build-api-success-response';
import { CreateNaturalRegionRequestDto } from './dto/create-natural-region.request.dto';
import { ListNaturalRegionsQueryDto } from './dto/list-natural-regions.query.dto';
import { NaturalRegionListResponseDto } from './dto/natural-region-list.response.dto';
import { NaturalRegionDataResponseDto, NaturalRegionResponseDto } from './dto/natural-region.response.dto';
import { UpdateNaturalRegionRequestDto } from './dto/update-natural-region.request.dto';

@ApiTags('natural-regions')
@Controller('natural-regions')
export class NaturalRegionsController {
    constructor(
        private readonly createNaturalRegionUseCase: CreateNaturalRegionUseCase,
        private readonly getNaturalRegionByIdUseCase: GetNaturalRegionByIdUseCase,
        private readonly listNaturalRegionsUseCase: ListNaturalRegionsUseCase,
        private readonly updateNaturalRegionUseCase: UpdateNaturalRegionUseCase,
        private readonly deleteNaturalRegionUseCase: DeleteNaturalRegionUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a natural region' })
    @ApiCreatedResponse({ type: NaturalRegionDataResponseDto, description: 'Natural region created successfully' })
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
                message: 'Invalid natural region data: name must not be empty.',
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
    async create(@Body() requestDto: CreateNaturalRegionRequestDto): Promise<NaturalRegionDataResponseDto> {
        const command = new CreateNaturalRegionCommand(requestDto.name);
        const naturalRegion = await this.createNaturalRegionUseCase.execute(command);
        return buildApiSuccessResponse(NaturalRegionResponseDto.fromDomain(naturalRegion), HttpStatus.CREATED);
    }

    @Get()
    @ApiOperation({ summary: 'List natural regions with pagination' })
    @ApiOkResponse({ type: NaturalRegionListResponseDto, description: 'Paginated list of natural regions' })
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
    async list(@Query() queryDto: ListNaturalRegionsQueryDto): Promise<NaturalRegionListResponseDto> {
        const query = new ListNaturalRegionsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listNaturalRegionsUseCase.execute(query);
        return buildApiPaginatedSuccessResponse(
            result.data.map((naturalRegion) => NaturalRegionResponseDto.fromDomain(naturalRegion)),
            result.meta,
            HttpStatus.OK,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get natural region by id' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Natural region numeric identifier' })
    @ApiOkResponse({ type: NaturalRegionDataResponseDto, description: 'Natural region found' })
    @ApiNotFoundResponse({
        description: 'Natural region not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Natural region with id 99 not found.',
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
    async getById(@Param('id', ParseIntPipe) id: number): Promise<NaturalRegionDataResponseDto> {
        const naturalRegion = await this.getNaturalRegionByIdUseCase.execute(new GetNaturalRegionByIdQuery(id));
        return buildApiSuccessResponse(NaturalRegionResponseDto.fromDomain(naturalRegion), HttpStatus.OK);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a natural region' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Natural region numeric identifier' })
    @ApiOkResponse({ type: NaturalRegionDataResponseDto, description: 'Natural region updated successfully' })
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
        description: 'Natural region not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Natural region with id 99 not found.',
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
                message: 'Invalid natural region data: name must not exceed 50 characters.',
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
        @Body() requestDto: UpdateNaturalRegionRequestDto,
    ): Promise<NaturalRegionDataResponseDto> {
        const command = new UpdateNaturalRegionCommand(id, requestDto.name);
        const naturalRegion = await this.updateNaturalRegionUseCase.execute(command);
        return buildApiSuccessResponse(NaturalRegionResponseDto.fromDomain(naturalRegion), HttpStatus.OK);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete a natural region' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Natural region numeric identifier' })
    @ApiNoContentResponse({
        description: 'Natural region soft-deleted successfully (record is hidden, not physically removed)',
    })
    @ApiNotFoundResponse({
        description: 'Natural region not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Natural region with id 99 not found.',
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
        await this.deleteNaturalRegionUseCase.execute(new DeleteNaturalRegionCommand(id));
    }
}
