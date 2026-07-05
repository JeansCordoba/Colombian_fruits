# Arquitectura

Resumen de la arquitectura del proyecto. Para profundizar, consulta `docs/architecture/` en el repo.

## Clean Architecture + layer-first

```
interfaces → application → domain ← infrastructure
```

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Domain | `src/domain/` | Entidades, puertos, excepciones |
| Application | `src/application/` | Use cases, validadores |
| Infrastructure | `src/infrastructure/` | TypeORM, config, migraciones |
| Interfaces | `src/interfaces/` | Controllers, DTOs, módulos HTTP |

## Diagramas

| Diagrama | Tema |
|----------|------|
| [01-system-context](../architecture/diagrams/01-system-context.md) | Cliente → API → PostgreSQL |
| [02-clean-architecture-layers](../architecture/diagrams/02-clean-architecture-layers.md) | Capas y dependencias |
| [03-entity-relationship](../architecture/diagrams/03-entity-relationship.md) | ERD |
| [04-nestjs-modules](../architecture/diagrams/04-nestjs-modules.md) | Módulos NestJS |
| [05-deployment-docker](../architecture/diagrams/05-deployment-docker.md) | Docker Compose |
| [06-git-branching](../architecture/diagrams/06-git-branching.md) | Ramas Git |

## Bounded contexts

- **Catálogos:** departments, climates, type-plants, type-fruits, natural-regions, harvest-seasons
- **Families:** familias botánicas ligadas a type-plants
- **Fruits:** agregado principal con relaciones N:M

## ADRs

Decisiones arquitectónicas en `docs/architecture/adr/`.

## Aprendizaje

Para explicaciones en lenguaje sencillo: [Study/Home](Study/Home).
