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
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
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
import { CreateTypePlantRequestDto } from './dto/create-type-plant.request.dto';
import { ListTypePlantsQueryDto } from './dto/list-type-plants.query.dto';
import { TypePlantListResponseDto } from './dto/type-plant-list.response.dto';
import { TypePlantResponseDto } from './dto/type-plant.response.dto';
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
    @ApiOperation({ summary: 'Create a type plant' })
    @ApiCreatedResponse({ description: 'Type plant created' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    async create(@Body() requestDto: CreateTypePlantRequestDto): Promise<TypePlantResponseDto> {
        const command = new CreateTypePlantCommand(requestDto.name);
        const typePlant = await this.createTypePlantUseCase.execute(command);
        return TypePlantResponseDto.fromDomain(typePlant);
    }

    @Get()
    @ApiOperation({ summary: 'List type plants with pagination' })
    @ApiOkResponse({ type: TypePlantListResponseDto })
    async list(@Query() queryDto: ListTypePlantsQueryDto): Promise<TypePlantListResponseDto> {
        const query = new ListTypePlantsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listTypePlantsUseCase.execute(query);
        return {
            data: result.data.map((typePlant) => TypePlantResponseDto.fromDomain(typePlant)),
            meta: result.meta,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get type plant by id' })
    @ApiOkResponse({ type: TypePlantResponseDto })
    @ApiNotFoundResponse({ description: 'Type plant not found' })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<TypePlantResponseDto> {
        const typePlant = await this.getTypePlantByIdUseCase.execute(new GetTypePlantByIdQuery(id));
        return TypePlantResponseDto.fromDomain(typePlant);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a type plant' })
    @ApiOkResponse({ type: TypePlantResponseDto })
    @ApiNotFoundResponse({ description: 'Type plant not found' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() requestDto: UpdateTypePlantRequestDto,
    ): Promise<TypePlantResponseDto> {
        const command = new UpdateTypePlantCommand(id, requestDto.name);
        const typePlant = await this.updateTypePlantUseCase.execute(command);
        return TypePlantResponseDto.fromDomain(typePlant);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a type plant' })
    @ApiNoContentResponse({ description: 'Type plant deleted' })
    @ApiNotFoundResponse({ description: 'Type plant not found' })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.deleteTypePlantUseCase.execute(new DeleteTypePlantCommand(id));
    }
}
