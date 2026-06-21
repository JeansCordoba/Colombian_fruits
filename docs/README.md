# Colombian Fruits API — Documentación

Documentación pre-código del backend **NestJS + PostgreSQL** como caso de estudio de **Clean Architecture** con estructura **layer-first** (organizada por capas, no por módulos NestJS).

## Orden de lectura recomendado

1. [Bounded Contexts](./architecture/01-bounded-contexts.md) — módulos del dominio y sus relaciones
2. [Capas Clean Architecture](./architecture/02-clean-architecture-layers.md) — reglas de dependencia y qué va en cada capa
3. [Estructura layer-first](./architecture/03-layer-first-structure.md) — plantilla de carpetas por capa
4. [Secuencia CreateFruit](./architecture/04-sequence-create-fruit.md) — flujo completo del primer caso de uso
5. [Patrones de diseño](./architecture/05-design-patterns.md) — matriz de patrones con ejemplos del dominio
6. [Excepciones de dominio](./architecture/06-domain-exceptions.md) — convenciones, quién lanza qué, mapeo HTTP
7. [ERD / schema.dbml](./database/schema.dbml) — fuente de verdad del modelo de datos (alineado con [`colombian_fruits.png`](./colombian_fruits.png))
8. [Glosario botánico](./database/glossary.md) — términos del dominio
9. [Contrato API MVP](./api/endpoints.md) — endpoints antes de codificar controllers
10. [Checklist de arranque](./guides/00-project-kickoff-checklist.md) — criterio "listo para codificar"
11. [Guía vertical slice](./guides/01-vertical-slice-fruits.md) — implementación paso a paso de `fruits`
12. [Estado de implementación](./guides/02-implementation-status.md) — qué código ya existe en `src/`

## Architecture Decision Records (ADRs)

| ADR | Decisión |
|-----|----------|
| [001](./architecture/adr/001-nestjs-over-fastapi.md) | NestJS sobre FastAPI |
| [002](./architecture/adr/002-postgresql-neon.md) | PostgreSQL con Neon en producción |
| [003](./architecture/adr/003-typeorm-vs-prisma.md) | TypeORM sobre Prisma |
| [004](./architecture/adr/004-layer-first-structure.md) | Estructura layer-first + capa `interfaces/` |

## Estructura de esta carpeta

```
docs/
├── README.md                          # Este índice
├── database/
│   ├── schema.dbml                    # ERD versionado (dbdiagram.io)
│   └── glossary.md
├── architecture/
│   ├── 01-bounded-contexts.md
│   ├── 02-clean-architecture-layers.md
│   ├── 03-layer-first-structure.md
│   ├── 04-sequence-create-fruit.md
│   ├── 05-design-patterns.md
│   ├── 06-domain-exceptions.md
│   └── adr/
├── api/
│   └── endpoints.md
└── guides/
    ├── 00-project-kickoff-checklist.md
    ├── 01-vertical-slice-fruits.md
    └── 02-implementation-status.md
```

## Código actual

El dominio de `fruits` ya está iniciado en `src/domain/fruits/`. Ver [estado de implementación](./guides/02-implementation-status.md).

## Criterio "listo para codificar"

La documentación base está completa. El código sigue el vertical slice documentado en `src/` con estructura layer-first.
