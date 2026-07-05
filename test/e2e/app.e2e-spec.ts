import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { HealthController } from '../../src/interfaces/http/health/health.controller';

describe('HealthController (e2e)', () => {
    let app: INestApplication;
    const mockDataSource = {
        query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /health returns service status and database connectivity', async () => {
        const response = await request(app.getHttpServer()).get('/health').expect(200);
        expect(response.body).toMatchObject({
            status: 'ok',
            database: 'connected',
        });
        expect(response.body.timestamp).toBeDefined();
        expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1');
    });
});
