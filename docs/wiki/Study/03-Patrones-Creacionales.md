# Patrones creacionales — Inyección de dependencias

## ¿Qué es la inyección de dependencias (DI)?

**DI** significa que una clase **recibe** sus dependencias desde afuera (NestJS las resuelve) en lugar de crearlas con `new` dentro del constructor.

## Analogía cotidiana

Un chef no construye su propio horno en la cocina — el restaurante (NestJS) le provee el equipo. Si el horno se rompe, cambias el horno sin reentrenar al chef (cambias la implementación del repositorio, no el use case).

## ¿Por qué importa en Clean Architecture?

El use case depende de un **puerto** (interfaz). En tests usas un mock; en producción usas `FruitRepository` con TypeORM. El use case no cambia.

## Ejemplo real — tres piezas

### 1. Token (símbolo único)

`src/domain/fruits/repositories/fruit.repository.token.ts`

```typescript
export const FRUIT_REPOSITORY = Symbol('FRUIT_REPOSITORY');
```

TypeScript elimina las interfaces en runtime; el `Symbol` permite identificar qué implementación inyectar.

### 2. Wiring en el módulo NestJS

`src/interfaces/http/fruits/fruits.module.ts`

```typescript
providers: [
    CreateFruitUseCase,
    {
        provide: FRUIT_REPOSITORY,
        useClass: FruitRepository,
    },
],
```

### 3. Consumo en el use case

`src/application/fruits/use-cases/create-fruit/create-fruit.use-case.ts`

```typescript
constructor(
    @Inject(FRUIT_REPOSITORY)
    private readonly fruitRepository: FruitRepositoryPort,
) {}
```

El tipo es `FruitRepositoryPort` (interfaz del dominio). NestJS inyecta `FruitRepository` (clase concreta).

## Caso real que rompió el proyecto: `FAMILY_REPOSITORY`

`CreateFruitUseCase` necesita verificar que `familyId` existe. Para eso inyecta `FAMILY_REPOSITORY`.

`FruitsModule` importa `FamiliesModule`, pero **FamiliesModule debe exportar** el token:

`src/interfaces/http/families/families.module.ts`

```typescript
exports: [FAMILY_REPOSITORY],
```

Sin ese `exports`, NestJS lanza: *"Nest can't resolve dependencies of CreateFruitUseCase"*.

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| `new FruitRepository()` en use case | Tests imposibles, acoplamiento | Usar `@Inject(FRUIT_REPOSITORY)` |
| Olvidar registrar provider | Error al arrancar | Añadir en `providers` del módulo |
| Módulo A usa token de módulo B sin import | DI error | `imports: [BModule]` + `exports` en B |

## Siguiente paso

- [[Study/04-Patrones-Estructurales]]
