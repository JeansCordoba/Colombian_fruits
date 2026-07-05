# NestJS en este proyecto

## ¿Qué es?

**NestJS** es el framework que conecta HTTP, DI y TypeORM en la capa `interfaces/` e `infrastructure/`.

## Analogía cotidiana

NestJS es el director de orquesta: no toca instrumentos (dominio), pero coordina cuándo entra cada sección (módulo).

## ¿Por qué importa?

Entender módulos, providers e imports evita errores de DI difíciles de depurar.

## Ejemplo mínimo

```typescript
// interfaces/http/fruits/fruits.module.ts
@Module({
    imports: [FamiliesModule],  // necesita FAMILY_REPOSITORY exportado
    controllers: [FruitsController],
    providers: [
        CreateFruitUseCase,
        { provide: FRUIT_REPOSITORY, useClass: FruitRepository },
    ],
})
export class FruitsModule {}

// main.ts — pipes y filters globales
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
app.useGlobalFilters(new DomainExceptionFilter());
```

## Errores comunes

1. **Olvidar `imports: [FamiliesModule]`** en FruitsModule.
2. **Registrar controller sin su use case** en providers.
3. **Confundir `@Module` con la carpeta `domain/`** — son conceptos distintos.

## Siguiente paso

- [08-Glosario-Rapido](08-Glosario-Rapido)
- [Diagrama módulos NestJS](../../architecture/diagrams/04-nestjs-modules.md)
