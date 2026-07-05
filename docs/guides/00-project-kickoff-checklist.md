# Checklist — Listo para codificar

Completa los ítems obligatorios de documentación antes de avanzar con código en `src/`.

> Estado actual del backend: ver [`02-implementation-status.md`](./02-implementation-status.md).

## Documentación obligatoria

- [x] ERD exportado a [`../database/schema.dbml`](../database/schema.dbml)
- [x] Bounded contexts definidos en [`../architecture/01-bounded-contexts.md`](../architecture/01-bounded-contexts.md)
- [x] Diagrama de capas acordado en [`../architecture/02-clean-architecture-layers.md`](../architecture/02-clean-architecture-layers.md)
- [x] Estructura layer-first documentada en [`../architecture/03-layer-first-structure.md`](../architecture/03-layer-first-structure.md)
- [x] Matriz de patrones escrita en [`../architecture/05-design-patterns.md`](../architecture/05-design-patterns.md)
- [x] Endpoints MVP listados en [`../api/endpoints.md`](../api/endpoints.md)
- [x] ADRs de decisiones principales en [`../architecture/adr/`](../architecture/adr/)
- [x] Secuencia de `CreateFruit` documentada en [`../architecture/04-sequence-create-fruit.md`](../architecture/04-sequence-create-fruit.md)
- [x] Excepciones de dominio documentadas en [`../architecture/06-domain-exceptions.md`](../architecture/06-domain-exceptions.md)
- [ ] Skills/reglas del agente creadas en `.cursor/skills/` o `.cursor/rules/`

## Validación de comprensión

Responde **sí** a cada pregunta antes de continuar:

1. ¿Tengo el ERD versionado en el repo?
2. ¿Sé qué bounded contexts existen y cómo se relacionan?
3. ¿Tengo claro qué va en `domain/` vs `infrastructure/` vs `interfaces/`?
4. ¿Entiendo la regla `interfaces → application → domain ← infrastructure`?
5. ¿Documenté al menos un flujo de secuencia completo (`CreateFruit`)?
6. ¿Tengo la matriz de patrones con ejemplos concretos?
7. ¿Definí el vertical slice MVP (`CreateFruit` + `GetFruitById`)?
8. ¿Sé que la estructura es **layer-first** (no module-first)?

## Secuencia de arranque (post-checklist)

### Fase 1 — Bootstrap técnico

- [x] Proyecto con `package.json`, pnpm, TypeScript
- [x] `tsconfig.json` + `tsconfig.build.json` (decoradores NestJS)
- [x] `main.ts`, `app.module.ts`, Docker PostgreSQL
- [x] CORS configurable (`CORS_ORIGIN`)
- [x] `GET /health` con ping a BD

### Fase 2 — Vertical slice fruits

Seguir [`01-vertical-slice-fruits.md`](./01-vertical-slice-fruits.md):

- [x] `domain/fruits/` — entidad + puerto + token + excepciones
- [x] `application/fruits/` — CRUD use cases + validación FKs N:M + tests unitarios
- [x] `infrastructure/persistence/fruits/` — ORM entity + tablas puente + mapper + repository
- [x] `interfaces/http/fruits/` — controller + DTOs + Swagger
- [x] Migración TypeORM (`InitialSchema`) — ver [`02-implementation-status.md`](./02-implementation-status.md)
- [ ] Seed con datos de ejemplo — **fase futura en `develop`** (usuario implementará)

### Fase 3 — Catálogos

- [x] Replicar patrón layer-first en: families, type-plants, type-fruits, climates, departments, natural-regions, harvest-seasons

### Fase 4 — Calidad y despliegue

- [x] Tests e2e con Supertest (health + envelope catálogo)
- [x] Swagger (`@nestjs/swagger`)
- [ ] Deploy: Neon (DB) + hosting API — **fase futura en `develop`**

## Referencias

- Índice maestro: [`../README.md`](../README.md)
- Guía vertical slice: [`01-vertical-slice-fruits.md`](./01-vertical-slice-fruits.md)
- README raíz del repo: [`../../README.md`](../../README.md)
