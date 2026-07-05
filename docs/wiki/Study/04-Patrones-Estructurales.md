# Patrones estructurales — Repository, Mapper, DTO, Read Model

## ¿Qué es?

Patrones que organizan **cómo se estructuran los datos** entre capas.

## Analogía cotidiana

Un traductor (Mapper) convierte un documento legal al idioma del cliente (DTO), sin cambiar el significado legal (dominio).

## ¿Por qué importa?

Cada capa tiene su representación de datos. Mezclarlas acopla HTTP con la base de datos.

## Ejemplo mínimo

```typescript
// Mapper: ORM ↔ dominio
// infrastructure/persistence/fruits/fruit.mapper.ts
static toDomain(orm: FruitOrmEntity): Fruit { /* ... */ }

// Read Model: datos enriquecidos para lectura
// domain/fruits/read-models/fruit-with-relations.read-model.ts
export class FruitWithRelations { /* family, climates, ... */ }

// DTO: contrato HTTP
// interfaces/http/fruits/dto/create-fruit.request.dto.ts
export class CreateFruitRequestDto {
    @IsString() commonName: string;
}
```

## Errores comunes

1. **Devolver entidades ORM desde el controller** — expone detalles de persistencia.
2. **Usar el mismo tipo para request y response** — dificulta evolucionar la API.
3. **Mapper con lógica de negocio** — el mapper solo traduce, no decide reglas.

## Siguiente paso

- [05-Patrones-Comportamiento](05-Patrones-Comportamiento)
- [Patrones de diseño](../../architecture/05-design-patterns.md)
