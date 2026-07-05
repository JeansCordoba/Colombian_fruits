# Colombian Fruits API — Documentation

Technical documentation for the NestJS + PostgreSQL backend (Clean Architecture, layer-first).

**Status:** MVP complete on `main` — full CRUD for catalogs, families, fruits (N:M), migrations, unit + e2e tests.

## Reading order

1. [Bounded contexts](./architecture/01-bounded-contexts.md)
2. [Clean Architecture layers](./architecture/02-clean-architecture-layers.md)
3. [Layer-first folder structure](./architecture/03-layer-first-structure.md)
4. [Diagrams](./architecture/diagrams/) — system context, layers, ERD, NestJS modules, Docker, Git branches
5. [CreateFruit sequence](./architecture/04-sequence-create-fruit.md)
6. [Design patterns](./architecture/05-design-patterns.md)
7. [Domain exceptions](./architecture/06-domain-exceptions.md)
8. [Database schema (DBML)](./database/schema.dbml)
9. [API contract](./api/endpoints.md)
10. [Implementation status](./guides/02-implementation-status.md)

## Operations & learning (wiki)

Operational guides and the junior learning path live in the wiki (published from `docs/wiki/`):

| Resource | Link |
|----------|------|
| Wiki home | [GitHub Wiki](https://github.com/JeansCordoba/Colombian_fruits/wiki) · [repo source](./wiki/Home.md) |
| Installation | [Installation](./wiki/Installation.md) |
| Study (Spanish) | [Study/Home](./wiki/Study/Home.md) |

## Architecture Decision Records

| ADR | Decision |
|-----|----------|
| [001](./architecture/adr/001-nestjs-over-fastapi.md) | NestJS over FastAPI |
| [002](./architecture/adr/002-postgresql-neon.md) | PostgreSQL with Neon in production |
| [003](./architecture/adr/003-typeorm-vs-prisma.md) | TypeORM over Prisma |
| [004](./architecture/adr/004-layer-first-structure.md) | Layer-first + `interfaces/` layer |

## Folder layout

```
docs/
├── README.md                 # This index
├── api/endpoints.md          # HTTP contract
├── architecture/             # Design docs, diagrams, ADRs
├── database/                 # schema.dbml, glossary
├── guides/                   # Kickoff, vertical slice, status
└── wiki/                     # Source for GitHub Wiki
```

## MVP checklist

- [x] CRUD: 6 catalogs + families + fruits
- [x] N:M relations on fruits
- [x] HTTP envelope `{ success, data, statusCode }`
- [x] Soft delete
- [x] TypeORM migrations (`DATABASE_SYNCHRONIZE=false`)
- [x] Unit + e2e tests, Swagger, health check
- [ ] Seed script — planned on `develop` (user-owned)
- [ ] Production deployment — planned on `develop`
