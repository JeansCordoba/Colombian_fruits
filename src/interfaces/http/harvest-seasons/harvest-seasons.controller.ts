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
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
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
import { CreateHarvestSeasonRequestDto } from './dto/create-harvest-season.request.dto';
import { HarvestSeasonListResponseDto } from './dto/harvest-season-list.response.dto';
import { HarvestSeasonResponseDto } from './dto/harvest-season.response.dto';
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
    @ApiOperation({ summary: 'Create a harvest season' })
    @ApiCreatedResponse({ description: 'Harvest season created' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    async create(@Body() requestDto: CreateHarvestSeasonRequestDto): Promise<HarvestSeasonResponseDto> {
        const command = new CreateHarvestSeasonCommand(requestDto.startMonth, requestDto.endMonth);
        const harvestSeason = await this.createHarvestSeasonUseCase.execute(command);
        return HarvestSeasonResponseDto.fromDomain(harvestSeason);
    }

    @Get()
    @ApiOperation({ summary: 'List harvest seasons with pagination' })
    @ApiOkResponse({ type: HarvestSeasonListResponseDto })
    async list(@Query() queryDto: ListHarvestSeasonsQueryDto): Promise<HarvestSeasonListResponseDto> {
        const query = new ListHarvestSeasonsQuery(
            queryDto.page ?? DEFAULT_PAGE,
            queryDto.limit ?? DEFAULT_LIMIT,
        );
        const result = await this.listHarvestSeasonsUseCase.execute(query);
        return {
            data: result.data.map((harvestSeason) => HarvestSeasonResponseDto.fromDomain(harvestSeason)),
            meta: result.meta,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get harvest season by id' })
    @ApiOkResponse({ type: HarvestSeasonResponseDto })
    @ApiNotFoundResponse({ description: 'Harvest season not found' })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<HarvestSeasonResponseDto> {
        const harvestSeason = await this.getHarvestSeasonByIdUseCase.execute(
            new GetHarvestSeasonByIdQuery(id),
        );
        return HarvestSeasonResponseDto.fromDomain(harvestSeason);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a harvest season' })
    @ApiOkResponse({ type: HarvestSeasonResponseDto })
    @ApiNotFoundResponse({ description: 'Harvest season not found' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() requestDto: UpdateHarvestSeasonRequestDto,
    ): Promise<HarvestSeasonResponseDto> {
        const command = new UpdateHarvestSeasonCommand(id, requestDto.startMonth, requestDto.endMonth);
        const harvestSeason = await this.updateHarvestSeasonUseCase.execute(command);
        return HarvestSeasonResponseDto.fromDomain(harvestSeason);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a harvest season' })
    @ApiNoContentResponse({ description: 'Harvest season deleted' })
    @ApiNotFoundResponse({ description: 'Harvest season not found' })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.deleteHarvestSeasonUseCase.execute(new DeleteHarvestSeasonCommand(id));
    }
}
