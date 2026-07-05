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
    ApiConflictResponse,
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
import { CreateFamilyCommand } from '../../../application/families/use-cases/create-family/create-family.command';
import { CreateFamilyUseCase } from '../../../application/families/use-cases/create-family/create-family.use-case';
import { DeleteFamilyCommand } from '../../../application/families/use-cases/delete-family/delete-family.command';
import { DeleteFamilyUseCase } from '../../../application/families/use-cases/delete-family/delete-family.use-case';
import { GetFamilyByIdQuery } from '../../../application/families/use-cases/get-family-by-id/get-family-by-id.query';
import { GetFamilyByIdUseCase } from '../../../application/families/use-cases/get-family-by-id/get-family-by-id.use-case';
import { ListFamiliesQuery } from '../../../application/families/use-cases/list-families/list-families.query';
import { ListFamiliesUseCase } from '../../../application/families/use-cases/list-families/list-families.use-case';
import { UpdateFamilyCommand } from '../../../application/families/use-cases/update-family/update-family.command';
import { UpdateFamilyUseCase } from '../../../application/families/use-cases/update-family/update-family.use-case';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../application/shared/constants/pagination.constants';
import { ApiErrorResponseDto } from '../shared/dto/api-error.response.dto';
import { buildApiPaginatedSuccessResponse, buildApiSuccessResponse } from '../shared/http/build-api-success-response';
import { CreateFamilyRequestDto } from './dto/create-family.request.dto';
import { FamilyListResponseDto } from './dto/family-list.response.dto';
import { FamilyDataResponseDto, FamilyResponseDto } from './dto/family.response.dto';
import { ListFamiliesQueryDto } from './dto/list-families.query.dto';
import { UpdateFamilyRequestDto } from './dto/update-family.request.dto';

@ApiTags('families')
@Controller('families')
export class FamiliesController {
    constructor(
        private readonly createFamilyUseCase: CreateFamilyUseCase,
        private readonly getFamilyByIdUseCase: GetFamilyByIdUseCase,
        private readonly listFamiliesUseCase: ListFamiliesUseCase,
        private readonly updateFamilyUseCase: UpdateFamilyUseCase,
        private readonly deleteFamilyUseCase: DeleteFamilyUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a family' })
    @ApiCreatedResponse({ type: FamilyDataResponseDto, description: 'Family created successfully' })
    @ApiBadRequestResponse({
        description: 'Invalid request body',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['name must not be empty', 'typePlantId must not be less than 1'],
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
    @ApiConflictResponse({
        description: 'Family name already exists',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 409,
                message: 'Family with name Passifloraceae already exists.',
                error: 'Conflict',
            },
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Domain validation failed',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 422,
                message: 'Invalid family data: name must not be empty.',
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
    async create(@Body() requestDto: CreateFamilyRequestDto): Promise<FamilyDataResponseDto> {
        const command = new CreateFamilyCommand(requestDto.name, requestDto.typePlantId);
        const familyWithTypePlant = await this.createFamilyUseCase.execute(command);
        return buildApiSuccessResponse(
            FamilyResponseDto.fromDomain(familyWithTypePlant),
            HttpStatus.CREATED,
        );
    }

    @Get()
    @ApiOperation({ summary: 'List families with pagination' })
    @ApiOkResponse({ type: FamilyListResponseDto, description: 'Paginated list of families' })
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
    async list(@Query() queryDto: ListFamiliesQueryDto): Promise<FamilyListResponseDto> {
        const query = new ListFamiliesQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listFamiliesUseCase.execute(query);
        return buildApiPaginatedSuccessResponse(
            result.data.map((familyWithTypePlant) => FamilyResponseDto.fromDomain(familyWithTypePlant)),
            result.meta,
            HttpStatus.OK,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get family by id' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Family numeric identifier' })
    @ApiOkResponse({ type: FamilyDataResponseDto, description: 'Family found' })
    @ApiNotFoundResponse({
        description: 'Family not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Family with id 99 not found.',
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
    async getById(@Param('id', ParseIntPipe) id: number): Promise<FamilyDataResponseDto> {
        const familyWithTypePlant = await this.getFamilyByIdUseCase.execute(new GetFamilyByIdQuery(id));
        return buildApiSuccessResponse(
            FamilyResponseDto.fromDomain(familyWithTypePlant),
            HttpStatus.OK,
        );
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a family' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Family numeric identifier' })
    @ApiOkResponse({ type: FamilyDataResponseDto, description: 'Family updated successfully' })
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
        description: 'Family or type plant not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Family with id 99 not found.',
                error: 'Not Found',
            },
        },
    })
    @ApiConflictResponse({
        description: 'Family name already exists',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 409,
                message: 'Family with name Passifloraceae already exists.',
                error: 'Conflict',
            },
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Domain validation failed',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 422,
                message: 'Invalid family data: name must not exceed 50 characters.',
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
        @Body() requestDto: UpdateFamilyRequestDto,
    ): Promise<FamilyDataResponseDto> {
        const command = new UpdateFamilyCommand(id, requestDto.name, requestDto.typePlantId);
        const familyWithTypePlant = await this.updateFamilyUseCase.execute(command);
        return buildApiSuccessResponse(
            FamilyResponseDto.fromDomain(familyWithTypePlant),
            HttpStatus.OK,
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete a family' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Family numeric identifier' })
    @ApiNoContentResponse({
        description: 'Family soft-deleted successfully (record is hidden, not physically removed)',
    })
    @ApiNotFoundResponse({
        description: 'Family not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Family with id 99 not found.',
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
        await this.deleteFamilyUseCase.execute(new DeleteFamilyCommand(id));
    }
}
