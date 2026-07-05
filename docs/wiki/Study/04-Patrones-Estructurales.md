# Patrones estructurales — Repository, Mapper, DTO, Read Model

## ¿Qué son los patrones estructurales?

Organizan **cómo se representan y traducen los datos** entre capas. Cada capa habla su “idioma” — mezclarlos acopla HTTP con PostgreSQL.

## Analogía cotidiana

Un traductor en una embajada: el documento legal (dominio) no cambia; la versión para el ciudadano (DTO HTTP) usa otro formato pero el mismo significado.

## Las cuatro piezas en `fruits`

| Patrón | Capa | Archivo ejemplo |
|--------|------|-----------------|
| **Repository** | domain + infra | `fruit.repository.port.ts` / `fruit.repository.ts` |
| **Mapper** | infrastructure | `fruit.mapper.ts` |
| **DTO** | interfaces | `create-fruit.request.dto.ts` |
| **Read Model** | domain | `fruit-with-relations.read-model.ts` |

## Repository — contrato vs implementación

El **puerto** define *qué* se puede hacer:

```typescript
// src/domain/fruits/repositories/fruit.repository.port.ts
findByIdWithRelations(id: number): Promise<FruitWithRelations | null>;
```

La **implementación** define *cómo* (SQL, joins, transacciones):

```typescript
// src/infrastructure/persistence/fruits/fruit.repository.ts
async findByIdWithRelations(id: number): Promise<FruitWithRelations | null> {
    // TypeORM query con relations...
}
```

## Mapper — traducción ORM ↔ dominio

`src/infrastructure/persistence/fruits/fruit.mapper.ts`

```typescript
static toDomain(orm: FruitOrmEntity): Fruit { /* ... */ }
static toPersistence(domain: Fruit): Partial<FruitOrmEntity> { /* ... */ }
```

El mapper **no decide reglas de negocio** — solo convierte formas de datos.

## DTO — contrato HTTP

`src/interfaces/http/fruits/dto/create-fruit.request.dto.ts`

```typescript
export class CreateFruitRequestDto {
    @IsString()
    @IsNotEmpty()
    commonName: string;

    @IsInt()
    familyId: number;

    @IsArray()
    @IsInt({ each: true })
    climateIds: number[];
}
```

`ValidationPipe` global valida antes de llegar al use case → errores **400** automáticos.

## Read Model — lectura enriquecida

`GetFruitByIdUseCase` retorna `FruitWithRelations` (familia + typePlant + climates + …), no la entidad `Fruit` plana. Es un **modelo de lectura** optimizado para la respuesta HTTP.

## Envelope de respuesta

Los controllers no devuelven el DTO crudo — usan helpers:

`src/interfaces/http/shared/http/build-api-success-response.ts`

```typescript
buildApiSuccessResponse(data, statusCode) // → { success, data, statusCode }
buildApiPaginatedSuccessResponse(data, meta, statusCode) // añade meta
```

## Errores comunes

1. **Devolver `FruitOrmEntity` al cliente** — filtra detalles internos de BD.
2. **Usar el mismo tipo para request y response** — dificulta evolucionar la API.
3. **Mapper con `if (familyId > 0)`** — esa lógica va en el use case.

## Siguiente paso

- [[Study/05-Patrones-Comportamiento]]
- [Patrones de diseño (repo)](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/05-design-patterns.md)
