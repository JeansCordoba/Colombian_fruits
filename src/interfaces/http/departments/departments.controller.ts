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
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreateDepartmentCommand } from '../../../application/departments/use-cases/create-department/create-department.command';
import { CreateDepartmentUseCase } from '../../../application/departments/use-cases/create-department/create-department.use-case';
import { DeleteDepartmentCommand } from '../../../application/departments/use-cases/delete-department/delete-department.command';
import { DeleteDepartmentUseCase } from '../../../application/departments/use-cases/delete-department/delete-department.use-case';
import { GetDepartmentByIdQuery } from '../../../application/departments/use-cases/get-department-by-id/get-department-by-id.query';
import { GetDepartmentByIdUseCase } from '../../../application/departments/use-cases/get-department-by-id/get-department-by-id.use-case';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../application/departments/constants/pagination.constants';
import { ListDepartmentsQuery } from '../../../application/departments/use-cases/list-departments/list-departments.query';
import { ListDepartmentsUseCase } from '../../../application/departments/use-cases/list-departments/list-departments.use-case';
import { UpdateDepartmentCommand } from '../../../application/departments/use-cases/update-department/update-department.command';
import { UpdateDepartmentUseCase } from '../../../application/departments/use-cases/update-department/update-department.use-case';
import { CreateDepartmentRequestDto } from './dto/create-department.request.dto';
import { DepartmentListResponseDto } from './dto/department-list.response.dto';
import { DepartmentResponseDto } from './dto/department.response.dto';
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
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a department' })
    @ApiCreatedResponse({ type: DepartmentResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid request body' })
    @ApiResponse({ status: 409, description: 'Department code already exists' })
    async create(@Body() requestDto: CreateDepartmentRequestDto): Promise<DepartmentResponseDto> {
        const command = new CreateDepartmentCommand(requestDto.name, requestDto.code);
        const department = await this.createDepartmentUseCase.execute(command);
        return DepartmentResponseDto.fromDomain(department);
    }

    @Get()
    @ApiOperation({ summary: 'List departments with pagination' })
    @ApiOkResponse({ type: DepartmentListResponseDto })
    async list(@Query() queryDto: ListDepartmentsQueryDto): Promise<DepartmentListResponseDto> {
        const query = new ListDepartmentsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listDepartmentsUseCase.execute(query);
        return {
            data: result.data.map((department) => DepartmentResponseDto.fromDomain(department)),
            meta: result.meta,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get department by id' })
    @ApiOkResponse({ type: DepartmentResponseDto })
    @ApiResponse({ status: 404, description: 'Department not found' })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<DepartmentResponseDto> {
        const department = await this.getDepartmentByIdUseCase.execute(new GetDepartmentByIdQuery(id));
        return DepartmentResponseDto.fromDomain(department);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a department' })
    @ApiOkResponse({ type: DepartmentResponseDto })
    @ApiResponse({ status: 404, description: 'Department not found' })
    @ApiResponse({ status: 409, description: 'Department code already exists' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() requestDto: UpdateDepartmentRequestDto,
    ): Promise<DepartmentResponseDto> {
        const command = new UpdateDepartmentCommand(id, requestDto.name, requestDto.code);
        const department = await this.updateDepartmentUseCase.execute(command);
        return DepartmentResponseDto.fromDomain(department);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a department' })
    @ApiNoContentResponse({ description: 'Department deleted' })
    @ApiResponse({ status: 404, description: 'Department not found' })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.deleteDepartmentUseCase.execute(new DeleteDepartmentCommand(id));
    }
}
