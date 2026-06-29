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
import { CreateClimateCommand } from '../../../application/climates/use-cases/create-climate/create-climate.command';
import { CreateClimateUseCase } from '../../../application/climates/use-cases/create-climate/create-climate.use-case';
import { DeleteClimateCommand } from '../../../application/climates/use-cases/delete-climate/delete-climate.command';
import { DeleteClimateUseCase } from '../../../application/climates/use-cases/delete-climate/delete-climate.use-case';
import { GetClimateByIdQuery } from '../../../application/climates/use-cases/get-climate-by-id/get-climate-by-id.query';
import { GetClimateByIdUseCase } from '../../../application/climates/use-cases/get-climate-by-id/get-climate-by-id.use-case';
import { ListClimatesQuery } from '../../../application/climates/use-cases/list-climates/list-climates.query';
import { ListClimatesUseCase } from '../../../application/climates/use-cases/list-climates/list-climates.use-case';
import { UpdateClimateCommand } from '../../../application/climates/use-cases/update-climate/update-climate.command';
import { UpdateClimateUseCase } from '../../../application/climates/use-cases/update-climate/update-climate.use-case';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../application/shared/constants/pagination.constants';
import { ApiErrorResponseDto } from '../shared/dto/api-error.response.dto';
import { buildApiPaginatedSuccessResponse, buildApiSuccessResponse } from '../shared/http/build-api-success-response';
import { ClimateListResponseDto } from './dto/climate-list.response.dto';
import { ClimateDataResponseDto, ClimateResponseDto } from './dto/climate.response.dto';
import { CreateClimateRequestDto } from './dto/create-climate.request.dto';
import { ListClimatesQueryDto } from './dto/list-climates.query.dto';
import { UpdateClimateRequestDto } from './dto/update-climate.request.dto';

@ApiTags('climates')
@Controller('climates')
export class ClimatesController {
    constructor(
        private readonly createClimateUseCase: CreateClimateUseCase,
        private readonly getClimateByIdUseCase: GetClimateByIdUseCase,
        private readonly listClimatesUseCase: ListClimatesUseCase,
        private readonly updateClimateUseCase: UpdateClimateUseCase,
        private readonly deleteClimateUseCase: DeleteClimateUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a climate' })
    @ApiCreatedResponse({ type: ClimateDataResponseDto, description: 'Climate created successfully' })
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
                message: 'Invalid climate data: name must not be empty.',
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
    async create(@Body() requestDto: CreateClimateRequestDto): Promise<ClimateDataResponseDto> {
        const command = new CreateClimateCommand(requestDto.name);
        const climate = await this.createClimateUseCase.execute(command);
        return buildApiSuccessResponse(ClimateResponseDto.fromDomain(climate), HttpStatus.CREATED);
    }

    @Get()
    @ApiOperation({ summary: 'List climates with pagination' })
    @ApiOkResponse({ type: ClimateListResponseDto, description: 'Paginated list of climates' })
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
    async list(@Query() queryDto: ListClimatesQueryDto): Promise<ClimateListResponseDto> {
        const query = new ListClimatesQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listClimatesUseCase.execute(query);
        return buildApiPaginatedSuccessResponse(
            result.data.map((climate) => ClimateResponseDto.fromDomain(climate)),
            result.meta,
            HttpStatus.OK,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get climate by id' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Climate numeric identifier' })
    @ApiOkResponse({ type: ClimateDataResponseDto, description: 'Climate found' })
    @ApiNotFoundResponse({
        description: 'Climate not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Climate with id 99 not found.',
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
    async getById(@Param('id', ParseIntPipe) id: number): Promise<ClimateDataResponseDto> {
        const climate = await this.getClimateByIdUseCase.execute(new GetClimateByIdQuery(id));
        return buildApiSuccessResponse(ClimateResponseDto.fromDomain(climate), HttpStatus.OK);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a climate' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Climate numeric identifier' })
    @ApiOkResponse({ type: ClimateDataResponseDto, description: 'Climate updated successfully' })
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
        description: 'Climate not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Climate with id 99 not found.',
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
                message: 'Invalid climate data: name must not exceed 50 characters.',
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
        @Body() requestDto: UpdateClimateRequestDto,
    ): Promise<ClimateDataResponseDto> {
        const command = new UpdateClimateCommand(id, requestDto.name);
        const climate = await this.updateClimateUseCase.execute(command);
        return buildApiSuccessResponse(ClimateResponseDto.fromDomain(climate), HttpStatus.OK);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete a climate' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Climate numeric identifier' })
    @ApiNoContentResponse({
        description: 'Climate soft-deleted successfully (record is hidden, not physically removed)',
    })
    @ApiNotFoundResponse({
        description: 'Climate not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Climate with id 99 not found.',
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
        await this.deleteClimateUseCase.execute(new DeleteClimateCommand(id));
    }
}
