# Colombian Fruits API — Documentación

Documentación del backend **NestJS + PostgreSQL** implementado como caso de estudio de **Clean Architecture** con estructura **layer-first**.

**Estado:** MVP completo en `main` — CRUD de catálogos, families, fruits (N:M), health check, migraciones TypeORM, tests unitarios y e2e.

## Orden de lectura recomendado

1. [Bounded Contexts](./architecture/01-bounded-contexts.md) — módulos del dominio y sus relaciones
2. [Capas Clean Architecture](./architecture/02-clean-architecture-layers.md) — reglas de dependencia
3. [Estructura layer-first](./architecture/03-layer-first-structure.md) — plantilla de carpetas por capa
4. [Diagramas Mermaid](./architecture/diagrams/) — contexto, capas, ERD, módulos NestJS, Docker, ramas Git
5. [Secuencia CreateFruit](./architecture/04-sequence-create-fruit.md) — flujo completo del caso de uso principal
6. [Patrones de diseño](./architecture/05-design-patterns.md) — matriz de patrones con ejemplos del dominio
7. [Excepciones de dominio](./architecture/06-domain-exceptions.md) — convenciones y mapeo HTTP
8. [ERD / schema.dbml](./database/schema.dbml) — modelo de datos versionado
9. [Glosario botánico](./database/glossary.md) — términos del dominio
10. [Contrato API](./api/endpoints.md) — endpoints con envelope HTTP
11. [Estado de implementación](./guides/02-implementation-status.md) — qué código existe en `src/`
12. [Wiki operativa](./wiki/Home.md) — guías de instalación, migraciones, testing
13. [Wiki de estudio](./wiki/Study/Home.md) — aprendizaje para desarrolladores junior

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
│   ├── diagrams/                      # 6 diagramas Mermaid
│   └── adr/
├── api/
│   └── endpoints.md
├── guides/
│   ├── 00-project-kickoff-checklist.md
│   ├── 01-vertical-slice-fruits.md
│   └── 02-implementation-status.md
└── wiki/                              # Fuente de verdad para GitHub Wiki
    ├── Home.md
    ├── Installation.md
    ├── Study/                         # Sección de aprendizaje
    └── ...
```

## Wiki y diagramas

- **Wiki en repo:** [`wiki/Home.md`](./wiki/Home.md) — guías operativas y sección Study para juniors
- **GitHub Wiki:** https://github.com/JeansCordoba/Colombian_fruits/wiki (copia publicada desde `docs/wiki/`)
- **Diagramas:** [`architecture/diagrams/`](./architecture/diagrams/) — renderizables en GitHub

## Criterio "MVP completo en main"

- [x] CRUD completo: 6 catálogos + families + fruits
- [x] Relaciones N:M en fruits (climates, departments, natural-regions, harvest-seasons)
- [x] Contrato HTTP con envelope `{ success, data, statusCode }`
- [x] Soft delete en catálogos y agregados
- [x] Migraciones TypeORM (`DATABASE_SYNCHRONIZE=false`)
- [x] Tests unitarios + e2e
- [x] Swagger + health check
- [ ] Seed de datos — pendiente (usuario, rama `develop`)
- [ ] Despliegue Neon + hosting — pendiente (rama `develop`)
