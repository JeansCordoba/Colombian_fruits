# Estado de implementación

Seguimiento del código construido vs. la arquitectura documentada.

## Estructura de código

```
src/
├── domain/               ✅ catálogos, families, fruits
├── application/          ✅ use cases + tests unitarios
├── infrastructure/       ✅ TypeORM, config, repositorios, migraciones
└── interfaces/           ✅ HTTP (controllers, DTOs, filtros)

Raíz del proyecto:
├── package.json          ✅ scripts build / typecheck / test:e2e / migration:*
├── README.md             ✅ guía de instalación completa
├── docker-compose.yml    ✅ PostgreSQL + API
├── Dockerfile            ✅ migraciones al arranque
└── .github/workflows/    ✅ CI (typecheck, test, build, Docker)
```

---

## Completado — Bootstrap

| Componente | Estado |
|------------|--------|
| `main.ts` | ✅ ValidationPipe, Swagger, CORS, global prefix `api/v1` (excluye `/health`) |
| `interfaces/app.module.ts` | ✅ Todos los módulos HTTP registrados |
| `interfaces/http/health/` | ✅ `GET /health` con ping `SELECT 1` |
| CORS configurable | ✅ `CORS_ORIGIN` en config + `.env.example` |
| Tests e2e | ✅ Health + envelope de catálogo (Supertest) |

---

## Completado — Catálogos (6 recursos)

CRUD completo con soft delete, paginación y contrato `{ success, data, statusCode }`:

- `departments`, `type-plants`, `type-fruits`, `climates`, `natural-regions`, `harvest-seasons`

Patrón de referencia: `src/interfaces/http/climates/`

---

## Completado — `families`

| Capa | Estado |
|------|--------|
| Domain | ✅ `Family`, `FamilyWithTypePlant`, excepciones `DomainException`, puerto con paginación/soft delete |
| Application | ✅ 5 use cases + tests unitarios |
| Infrastructure | ✅ ORM, mapper, repository |
| Interfaces HTTP | ✅ Controller, DTOs, Swagger inline, `FamiliesModule` |

---

## Completado — `fruits` (vertical slice)

| Capa | Estado |
|------|--------|
| Domain | ✅ Entidad, `FruitWithRelations`, read models, puerto N:M, excepciones |
| Application | ✅ Create, Get, List, Update, Delete + `FruitRelationsValidator` + tests |
| Infrastructure | ✅ ORM + tablas puente (`fruit_climates`, `fruit_departments`, etc.), repository transaccional |
| Interfaces HTTP | ✅ CRUD completo, DTOs anidados, re-fetch post-create vía `GetFruitByIdUseCase` |

Respuesta GET incluye: `family.typePlant`, `typeFruit`, `climates[]`, `departments[]`, `naturalRegions[]`, `harvestSeasons[]`.

---

## Migraciones

| Tema | Estado | Notas |
|------|--------|-------|
| TypeORM migrations | ✅ Completado | `InitialSchema` en `src/infrastructure/persistence/migrations/` |
| `data-source.ts` + CLI | ✅ Completado | `pnpm migration:run`, `migration:revert`, `migration:show` |
| `DATABASE_SYNCHRONIZE=false` | ✅ Completado | `.env.example`, `docker-compose.yml`, producción |
| Docker startup | ✅ Completado | `run-migrations.js` antes de `main.js` |

Tras `pnpm migration:run` las tablas quedan **vacías**. Poblar catálogos vía API (Swagger/Postman).

---

## Pendiente — fase `develop`

| Tema | Estado | Notas |
|------|--------|-------|
| Seed script | ⬜ Pendiente (usuario) | El usuario recolectará datos e implementará el script |
| Despliegue Neon + hosting API | ⬜ Pendiente | Ver ADR 002 y wiki Roadmap |
| Filtros avanzados en fruits | ⬜ Pendiente | `?climate=`, `?department=` |

---

## Comandos de verificación

```bash
pnpm typecheck
pnpm test:ci
pnpm build
pnpm test:e2e
docker compose up -d postgres
pnpm migration:run
pnpm start:dev
# Swagger: http://localhost:3000/api/docs
# Health:  http://localhost:3000/health
```

---

## Referencias

- Contrato API: [`../api/endpoints.md`](../api/endpoints.md)
- Guía vertical slice: [`01-vertical-slice-fruits.md`](./01-vertical-slice-fruits.md)
- Migraciones: [`../wiki/Database-Migrations.md`](../wiki/Database-Migrations.md)
- Excepciones: [`../architecture/06-domain-exceptions.md`](../architecture/06-domain-exceptions.md)
