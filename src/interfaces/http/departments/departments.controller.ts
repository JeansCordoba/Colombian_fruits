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
import { CreateDepartmentCommand } from '../../../application/departments/use-cases/create-department/create-department.command';
import { CreateDepartmentUseCase } from '../../../application/departments/use-cases/create-department/create-department.use-case';
import { DeleteDepartmentCommand } from '../../../application/departments/use-cases/delete-department/delete-department.command';
import { DeleteDepartmentUseCase } from '../../../application/departments/use-cases/delete-department/delete-department.use-case';
import { GetDepartmentByIdQuery } from '../../../application/departments/use-cases/get-department-by-id/get-department-by-id.query';
import { GetDepartmentByIdUseCase } from '../../../application/departments/use-cases/get-department-by-id/get-department-by-id.use-case';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../application/shared/constants/pagination.constants';
import { ListDepartmentsQuery } from '../../../application/departments/use-cases/list-departments/list-departments.query';
import { ListDepartmentsUseCase } from '../../../application/departments/use-cases/list-departments/list-departments.use-case';
import { UpdateDepartmentCommand } from '../../../application/departments/use-cases/update-department/update-department.command';
import { UpdateDepartmentUseCase } from '../../../application/departments/use-cases/update-department/update-department.use-case';
import { ApiErrorResponseDto } from '../shared/dto/api-error.response.dto';
import { buildApiPaginatedSuccessResponse, buildApiSuccessResponse } from '../shared/http/build-api-success-response';
import { CreateDepartmentRequestDto } from './dto/create-department.request.dto';
import { DepartmentListResponseDto } from './dto/department-list.response.dto';
import { DepartmentDataResponseDto, DepartmentResponseDto } from './dto/department.response.dto';
import { ListDepartmentsQueryDto } from './dto/list-departments.query.dto';
import { UpdateDepartmentRequestDto } from './dto/update-department.request.dto';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
    constructor(
        private readonly createDepartmentUseCase: CreateDepartmentUseCase,
        private readonly getDepartmentByIdUseCase: GetDepartmentByIdUseCase,
        private readonly listDepartmentsUseCase: ListDepartmentsUseCase,
        private readonly updateDepartmentUseCase: UpdateDepartmentUseCase,
        private readonly deleteDepartmentUseCase: DeleteDepartmentUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a department' })
    @ApiCreatedResponse({ type: DepartmentDataResponseDto, description: 'Department created successfully' })
    @ApiBadRequestResponse({
        description: 'Invalid request body',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 400,
                message: ['name must not be empty', 'code must not be empty'],
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
                message: 'Invalid department data: name must not exceed 50 characters.',
                error: 'Unprocessable Entity',
            },
        },
    })
    @ApiConflictResponse({
        description: 'Department code already exists',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 409,
                message: 'Department with code ANT already exists.',
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
    async create(@Body() requestDto: CreateDepartmentRequestDto): Promise<DepartmentDataResponseDto> {
        const command = new CreateDepartmentCommand(requestDto.name, requestDto.code);
        const department = await this.createDepartmentUseCase.execute(command);
        return buildApiSuccessResponse(
            DepartmentResponseDto.fromDomain(department),
            HttpStatus.CREATED,
        );
    }

    @Get()
    @ApiOperation({ summary: 'List departments with pagination' })
    @ApiOkResponse({ type: DepartmentListResponseDto, description: 'Paginated list of departments' })
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
    async list(@Query() queryDto: ListDepartmentsQueryDto): Promise<DepartmentListResponseDto> {
        const query = new ListDepartmentsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listDepartmentsUseCase.execute(query);
        return buildApiPaginatedSuccessResponse(
            result.data.map((department) => DepartmentResponseDto.fromDomain(department)),
            result.meta,
            HttpStatus.OK,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get department by id' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Department numeric identifier' })
    @ApiOkResponse({ type: DepartmentDataResponseDto, description: 'Department found' })
    @ApiNotFoundResponse({
        description: 'Department not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Department with id 99 not found.',
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
    async getById(@Param('id', ParseIntPipe) id: number): Promise<DepartmentDataResponseDto> {
        const department = await this.getDepartmentByIdUseCase.execute(new GetDepartmentByIdQuery(id));
        return buildApiSuccessResponse(
            DepartmentResponseDto.fromDomain(department),
            HttpStatus.OK,
        );
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a department' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Department numeric identifier' })
    @ApiOkResponse({ type: DepartmentDataResponseDto, description: 'Department updated successfully' })
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
        description: 'Department not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Department with id 99 not found.',
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
                message: 'Invalid department data: code must not exceed 50 characters.',
                error: 'Unprocessable Entity',
            },
        },
    })
    @ApiConflictResponse({
        description: 'Department code already exists',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 409,
                message: 'Department with code ANT already exists.',
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
        @Body() requestDto: UpdateDepartmentRequestDto,
    ): Promise<DepartmentDataResponseDto> {
        const command = new UpdateDepartmentCommand(id, requestDto.name, requestDto.code);
        const department = await this.updateDepartmentUseCase.execute(command);
        return buildApiSuccessResponse(
            DepartmentResponseDto.fromDomain(department),
            HttpStatus.OK,
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete a department' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Department numeric identifier' })
    @ApiNoContentResponse({
        description: 'Department soft-deleted successfully (record is hidden, not physically removed)',
    })
    @ApiNotFoundResponse({
        description: 'Department not found',
        type: ApiErrorResponseDto,
        schema: {
            example: {
                statusCode: 404,
                message: 'Department with id 99 not found.',
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
        await this.deleteDepartmentUseCase.execute(new DeleteDepartmentCommand(id));
    }
}
