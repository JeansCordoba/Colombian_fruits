# NestJS en este proyecto

## ¿Qué hace NestJS aquí?

NestJS es el **framework de composición**: conecta HTTP, inyección de dependencias y TypeORM. **No** contiene la lógica de negocio — esa vive en `domain/` y `application/`.

## Analogía cotidiana

NestJS es el director de orquesta: no toca los instrumentos (dominio), pero indica cuándo entra cada sección (módulo) y quién acompaña a quién (imports/exports).

## Piezas que debes conocer

| Concepto NestJS | Dónde en el proyecto |
|-----------------|----------------------|
| `@Module()` | `src/interfaces/http/*/ *.module.ts`, `app.module.ts` |
| `@Controller()` | `src/interfaces/http/*/ *.controller.ts` |
| `@Injectable()` | Use cases, repositories, validators |
| `ValidationPipe` | Global en `main.ts` |
| `ExceptionFilter` | `DomainExceptionFilter`, `UnhandledExceptionFilter` |

## AppModule — punto de entrada

`src/interfaces/app.module.ts`

```typescript
@Module({
    imports: [
        ConfigModule,
        DatabaseModule.forRoot(),
        HealthModule,
        DepartmentsModule,
        TypePlantsModule,
        // ... todos los catálogos
        FamiliesModule,
        FruitsModule,
    ],
})
export class AppModule {}
```

## Prefijo global y Swagger

`src/main.ts`

```typescript
app.setGlobalPrefix('api/v1', { exclude: ['health'] });
SwaggerModule.setup('api/docs', app, document);
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
app.useGlobalFilters(new UnhandledExceptionFilter(), new DomainExceptionFilter());
```

Por eso el controller usa `@Controller('fruits')` y la ruta final es `/api/v1/fruits`, no `/api/v1/api/v1/fruits`.

## FruitsModule — ejemplo completo

`src/interfaces/http/fruits/fruits.module.ts`

- **imports:** `FamiliesModule` (para `FAMILY_REPOSITORY`) + entidades ORM necesarias
- **controllers:** `FruitsController`
- **providers:** use cases + `{ provide: FRUIT_REPOSITORY, useClass: FruitRepository }` + repos de catálogos para el validator

## Health check

`src/interfaces/http/health/health.controller.ts`

```typescript
@Controller()
export class HealthController {
    @Get('health')
    async check() {
        await this.dataSource.query('SELECT 1');
        return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() };
    }
}
```

Excluido del prefijo `api/v1` — útil para Docker/Kubernetes probes.

## Errores comunes

| Error | Causa |
|-------|-------|
| DI: can't resolve dependency | Falta provider, import o export del token |
| 404 en ruta que “existe” | Olvidaste el prefijo `api/v1` |
| 400 con array de mensajes | ValidationPipe — revisa el DTO |

## Siguiente paso

- [[Study/08-Glosario-Rapido]]
- [Diagrama módulos NestJS](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/04-nestjs-modules.md)
