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
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
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
import { ClimateListResponseDto } from './dto/climate-list.response.dto';
import { ClimateResponseDto } from './dto/climate.response.dto';
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
    @ApiOperation({ summary: 'Create a climate' })
    @ApiCreatedResponse({ description: 'Climate created' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    async create(@Body() requestDto: CreateClimateRequestDto): Promise<ClimateResponseDto> {
        const command = new CreateClimateCommand(requestDto.name);
        const climate = await this.createClimateUseCase.execute(command);
        return ClimateResponseDto.fromDomain(climate);
    }

    @Get()
    @ApiOperation({ summary: 'List climates with pagination' })
    @ApiOkResponse({ type: ClimateListResponseDto })
    async list(@Query() queryDto: ListClimatesQueryDto): Promise<ClimateListResponseDto> {
        const query = new ListClimatesQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listClimatesUseCase.execute(query);
        return {
            data: result.data.map((climate) => ClimateResponseDto.fromDomain(climate)),
            meta: result.meta,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get climate by id' })
    @ApiOkResponse({ type: ClimateResponseDto })
    @ApiNotFoundResponse({ description: 'Climate not found' })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<ClimateResponseDto> {
        const climate = await this.getClimateByIdUseCase.execute(new GetClimateByIdQuery(id));
        return ClimateResponseDto.fromDomain(climate);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a climate' })
    @ApiOkResponse({ type: ClimateResponseDto })
    @ApiNotFoundResponse({ description: 'Climate not found' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() requestDto: UpdateClimateRequestDto,
    ): Promise<ClimateResponseDto> {
        const command = new UpdateClimateCommand(id, requestDto.name);
        const climate = await this.updateClimateUseCase.execute(command);
        return ClimateResponseDto.fromDomain(climate);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a climate' })
    @ApiNoContentResponse({ description: 'Climate deleted' })
    @ApiNotFoundResponse({ description: 'Climate not found' })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.deleteClimateUseCase.execute(new DeleteClimateCommand(id));
    }
}
