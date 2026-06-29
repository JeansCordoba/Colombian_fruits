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
import { CreateHarvestSeasonCommand } from '../../../application/harvest-seasons/use-cases/create-harvest-season/create-harvest-season.command';
import { CreateHarvestSeasonUseCase } from '../../../application/harvest-seasons/use-cases/create-harvest-season/create-harvest-season.use-case';
import { DeleteHarvestSeasonCommand } from '../../../application/harvest-seasons/use-cases/delete-harvest-season/delete-harvest-season.command';
import { DeleteHarvestSeasonUseCase } from '../../../application/harvest-seasons/use-cases/delete-harvest-season/delete-harvest-season.use-case';
import { GetHarvestSeasonByIdQuery } from '../../../application/harvest-seasons/use-cases/get-harvest-season-by-id/get-harvest-season-by-id.query';
import { GetHarvestSeasonByIdUseCase } from '../../../application/harvest-seasons/use-cases/get-harvest-season-by-id/get-harvest-season-by-id.use-case';
import { ListHarvestSeasonsQuery } from '../../../application/harvest-seasons/use-cases/list-harvest-seasons/list-harvest-seasons.query';
import { ListHarvestSeasonsUseCase } from '../../../application/harvest-seasons/use-cases/list-harvest-seasons/list-harvest-seasons.use-case';
import { UpdateHarvestSeasonCommand } from '../../../application/harvest-seasons/use-cases/update-harvest-season/update-harvest-season.command';
import { UpdateHarvestSeasonUseCase } from '../../../application/harvest-seasons/use-cases/update-harvest-season/update-harvest-season.use-case';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../application/shared/constants/pagination.constants';
import { ApiErrorResponseDto } from '../shared/dto/api-error.response.dto';
import { buildApiPaginatedSuccessResponse, buildApiSuccessResponse } from '../shared/http/build-api-success-response';
import { CreateHarvestSeasonRequestDto } from './dto/create-harvest-season.request.dto';
import { HarvestSeasonListResponseDto } from './dto/harvest-season-list.response.dto';
import { HarvestSeasonDataResponseDto, HarvestSeasonResponseDto } from './dto/harvest-season.response.dto';
import { ListHarvestSeasonsQueryDto } from './dto/list-harvest-seasons.query.dto';
import { UpdateHarvestSeasonRequestDto } from './dto/update-harvest-season.request.dto';

@ApiTags('harvest-seasons')
@Controller('harvest-seasons')
export class HarvestSeasonsController {
    constructor(
        private readonly createHarvestSeasonUseCase: CreateHarvestSeasonUseCase,
        private readonly getHarvestSeasonByIdUseCase: GetHarvestSeasonByIdUseCase,
        private readonly listHarvestSeasonsUseCase: ListHarvestSeasonsUseCase,
        private readonly updateHarvestSeasonUseCase: UpdateHarvestSeasonUseCase,
        private readonly deleteHarvestSeasonUseCase: DeleteHarvestSeasonUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a harvest season' })
    @ApiCreatedResponse({ type: HarvestSeasonDataResponseDto, description: 'Harvest season created successfully' })
    @ApiBadRequestResponse({
        description: 'Invalid request body',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['startMonth must not be less than 1', 'endMonth must not be greater than 12'],
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
                message: 'Invalid harvest season data: startMonth must be between 1 and 12.',
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
    async create(@Body() requestDto: CreateHarvestSeasonRequestDto): Promise<HarvestSeasonDataResponseDto> {
        const command = new CreateHarvestSeasonCommand(requestDto.startMonth, requestDto.endMonth);
        const harvestSeason = await this.createHarvestSeasonUseCase.execute(command);
        return buildApiSuccessResponse(HarvestSeasonResponseDto.fromDomain(harvestSeason), HttpStatus.CREATED);
    }

    @Get()
    @ApiOperation({ summary: 'List harvest seasons with pagination' })
    @ApiOkResponse({ type: HarvestSeasonListResponseDto, description: 'Paginated list of harvest seasons' })
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
    async list(@Query() queryDto: ListHarvestSeasonsQueryDto): Promise<HarvestSeasonListResponseDto> {
        const query = new ListHarvestSeasonsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listHarvestSeasonsUseCase.execute(query);
        return buildApiPaginatedSuccessResponse(
            result.data.map((harvestSeason) => HarvestSeasonResponseDto.fromDomain(harvestSeason)),
            result.meta,
            HttpStatus.OK,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get harvest season by id' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Harvest season numeric identifier' })
    @ApiOkResponse({ type: HarvestSeasonDataResponseDto, description: 'Harvest season found' })
    @ApiNotFoundResponse({
        description: 'Harvest season not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Harvest season with id 99 not found.',
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
    async getById(@Param('id', ParseIntPipe) id: number): Promise<HarvestSeasonDataResponseDto> {
        const harvestSeason = await this.getHarvestSeasonByIdUseCase.execute(
            new GetHarvestSeasonByIdQuery(id),
        );
        return buildApiSuccessResponse(HarvestSeasonResponseDto.fromDomain(harvestSeason), HttpStatus.OK);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a harvest season' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Harvest season numeric identifier' })
    @ApiOkResponse({ type: HarvestSeasonDataResponseDto, description: 'Harvest season updated successfully' })
    @ApiBadRequestResponse({
        description: 'Invalid request body',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['startMonth must not be less than 1'],
                error: 'Bad Request',
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'Harvest season not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Harvest season with id 99 not found.',
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
                message: 'Invalid harvest season data: endMonth must be between 1 and 12.',
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
        @Body() requestDto: UpdateHarvestSeasonRequestDto,
    ): Promise<HarvestSeasonDataResponseDto> {
        const command = new UpdateHarvestSeasonCommand(id, requestDto.startMonth, requestDto.endMonth);
        const harvestSeason = await this.updateHarvestSeasonUseCase.execute(command);
        return buildApiSuccessResponse(HarvestSeasonResponseDto.fromDomain(harvestSeason), HttpStatus.OK);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete a harvest season' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Harvest season numeric identifier' })
    @ApiNoContentResponse({
        description: 'Harvest season soft-deleted successfully (record is hidden, not physically removed)',
    })
    @ApiNotFoundResponse({
        description: 'Harvest season not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Harvest season with id 99 not found.',
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
        await this.deleteHarvestSeasonUseCase.execute(new DeleteHarvestSeasonCommand(id));
    }
}
