# ADR 003 — TypeORM sobre Prisma

## Estado

Aceptado

## Contexto

NestJS necesita un ORM para la capa `infrastructure/`. Los candidatos principales son TypeORM y Prisma. El proyecto sigue Clean Architecture con Repository pattern explícito: entidad de dominio separada de entidad de persistencia.

## Decisión

Adoptar **TypeORM** como ORM de la capa `infrastructure/persistence/`.

## Razones

| Criterio | TypeORM | Prisma |
|----------|---------|--------|
| Repository pattern clásico | ✓ Entidades decoradas, repositorios custom | Cliente generado, menos separación |
| Entidad ORM separada de dominio | ✓ Natural con `@Entity` + mapper | Schema Prisma acopla al modelo |
| Integración NestJS | ✓ `@nestjs/typeorm` oficial | `@nestjs/prisma` community |
| Migraciones | ✓ TypeORM migrations | ✓ Prisma migrate |
| Control de queries N:M | ✓ QueryBuilder / transacciones | ✓ pero vía client generado |
| Alineación con objetivo de aprendizaje CA | ✓ Fuerza mapper explícito | Más productivo, menos capas visibles |

## Consecuencias

### Positivas

- `@Entity` vive exclusivamente en `infrastructure/` — refuerza la regla de que `domain/` no conoce TypeORM.
- `FruitMapper.toDomain()` / `toPersistence()` es obligatorio y visible — buen ejercicio de Clean Architecture.
- Repositorios custom implementan puertos del dominio sin magia del ORM.
- `@nestjs/typeorm` es el paquete oficial de NestJS.

### Negativas

- TypeORM tiene más boilerplate que Prisma.
- DX de Prisma (autocompletado, studio) es superior.
- Migraciones TypeORM son menos ergonómicas que `prisma migrate dev`.

## Estructura resultante

```
domain/fruits/entities/fruit.entity.ts           # Dominio puro
infrastructure/persistence/fruits/fruit.orm-entity.ts  # TypeORM @Entity
infrastructure/persistence/fruits/fruit.mapper.ts    # Traducción
infrastructure/persistence/fruits/postgres-fruit.repository.ts  # Puerto impl
```

## Alternativas descartadas

- **Prisma:** más productivo para CRUD rápido, pero el client generado tiende a filtrarse hacia capas superiores y dificulta el ejercicio de separación domain/infra.
- **Knex / query builder puro:** máximo control pero demasiado boilerplate para un caso de estudio.
- **Sin ORM (SQL raw):** válido para aprendizaje, pero TypeORM es un balance razonable.

## Referencias

- [TypeORM](https://typeorm.io/)
- [NestJS TypeORM](https://docs.nestjs.com/techniques/database)
- Capas: [`../02-clean-architecture-layers.md`](../02-clean-architecture-layers.md)
