import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthResponseDto } from './dto/health.response.dto';

@ApiTags('health')
@Controller()
export class HealthController {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {}

    @Get('health')
    @ApiOperation({ summary: 'Health check with database ping' })
    @ApiOkResponse({ type: HealthResponseDto, description: 'Service is healthy' })
    async check(): Promise<HealthResponseDto> {
        await this.dataSource.query('SELECT 1');
        return {
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString(),
        };
    }
}
