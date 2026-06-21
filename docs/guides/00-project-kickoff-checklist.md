# Checklist — Listo para codificar

Completa los ítems obligatorios de documentación antes de avanzar con código en `src/`.

> El dominio de `fruits` ya está iniciado. Ver [`02-implementation-status.md`](./02-implementation-status.md).

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

- [ ] Proyecto NestJS con `main.ts` y estructura layer-first en `src/`
- [ ] Configurar ESLint, Prettier, path aliases
- [ ] Docker Compose con PostgreSQL local
- [ ] Variables de entorno (`.env.example`)
- [ ] Módulo shared de configuración y base de datos
- [ ] Health check: `GET /health`

### Fase 2 — Vertical slice fruits

Seguir [`01-vertical-slice-fruits.md`](./01-vertical-slice-fruits.md):

- [x] `domain/fruits/` — entidad + puerto + token + excepciones
- [ ] `application/fruits/` — CreateFruitUseCase + GetFruitByIdUseCase
- [ ] `infrastructure/persistence/fruits/` — ORM entity + mapper + repository
- [ ] `interfaces/http/fruits/` — controller + DTOs
- [ ] Test unitario del use case
- [ ] Primera migración TypeORM
- [ ] Seed con 3–5 frutas de ejemplo

### Fase 3 — Catálogos

- [ ] Replicar patrón layer-first en: families, type-plants, type-fruits, climates, departments, natural-regions, harvest-seasons

### Fase 4 — Calidad y despliegue

- [ ] Tests e2e con Supertest
- [ ] Swagger (`@nestjs/swagger`)
- [ ] Deploy: Neon (DB) + Render (API)

## Referencias

- Índice maestro: [`../README.md`](../README.md)
- Guía vertical slice: [`01-vertical-slice-fruits.md`](./01-vertical-slice-fruits.md)
