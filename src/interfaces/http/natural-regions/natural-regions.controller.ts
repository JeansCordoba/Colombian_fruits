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
import { CreateNaturalRegionRequestDto } from './dto/create-natural-region.request.dto';
import { ListNaturalRegionsQueryDto } from './dto/list-natural-regions.query.dto';
import { NaturalRegionListResponseDto } from './dto/natural-region-list.response.dto';
import { NaturalRegionResponseDto } from './dto/natural-region.response.dto';
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
    @ApiOperation({ summary: 'Create a natural region' })
    @ApiCreatedResponse({ description: 'Natural region created' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    async create(@Body() requestDto: CreateNaturalRegionRequestDto): Promise<NaturalRegionResponseDto> {
        const command = new CreateNaturalRegionCommand(requestDto.name);
        const naturalRegion = await this.createNaturalRegionUseCase.execute(command);
        return NaturalRegionResponseDto.fromDomain(naturalRegion);
    }

    @Get()
    @ApiOperation({ summary: 'List natural regions with pagination' })
    @ApiOkResponse({ type: NaturalRegionListResponseDto })
    async list(@Query() queryDto: ListNaturalRegionsQueryDto): Promise<NaturalRegionListResponseDto> {
        const query = new ListNaturalRegionsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listNaturalRegionsUseCase.execute(query);
        return {
            data: result.data.map((naturalRegion) => NaturalRegionResponseDto.fromDomain(naturalRegion)),
            meta: result.meta,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get natural region by id' })
    @ApiOkResponse({ type: NaturalRegionResponseDto })
    @ApiNotFoundResponse({ description: 'Natural region not found' })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<NaturalRegionResponseDto> {
        const naturalRegion = await this.getNaturalRegionByIdUseCase.execute(new GetNaturalRegionByIdQuery(id));
        return NaturalRegionResponseDto.fromDomain(naturalRegion);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a natural region' })
    @ApiOkResponse({ type: NaturalRegionResponseDto })
    @ApiNotFoundResponse({ description: 'Natural region not found' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() requestDto: UpdateNaturalRegionRequestDto,
    ): Promise<NaturalRegionResponseDto> {
        const command = new UpdateNaturalRegionCommand(id, requestDto.name);
        const naturalRegion = await this.updateNaturalRegionUseCase.execute(command);
        return NaturalRegionResponseDto.fromDomain(naturalRegion);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a natural region' })
    @ApiNoContentResponse({ description: 'Natural region deleted' })
    @ApiNotFoundResponse({ description: 'Natural region not found' })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.deleteNaturalRegionUseCase.execute(new DeleteNaturalRegionCommand(id));
    }
}
