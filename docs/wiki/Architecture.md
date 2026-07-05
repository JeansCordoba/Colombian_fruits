# Arquitectura

Resumen de la arquitectura del proyecto. Para el detalle completo, consulta la documentación en el repositorio.

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

## Diagramas (en el repo)

Los diagramas Mermaid se mantienen en `docs/architecture/diagrams/` para renderizarse en GitHub:

| Diagrama | Tema |
|----------|------|
| [01-system-context](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/01-system-context.md) | Cliente → API → PostgreSQL |
| [02-clean-architecture-layers](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/02-clean-architecture-layers.md) | Capas y dependencias |
| [03-entity-relationship](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/03-entity-relationship.md) | ERD |
| [04-nestjs-modules](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/04-nestjs-modules.md) | Módulos NestJS |
| [05-deployment-docker](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/05-deployment-docker.md) | Docker Compose |
| [06-git-branching](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/06-git-branching.md) | Ramas Git |

## Bounded contexts

- **Catálogos:** departments, climates, type-plants, type-fruits, natural-regions, harvest-seasons
- **Families:** familias botánicas ligadas a type-plants
- **Fruits:** agregado principal con relaciones N:M

## ADRs

[Architecture Decision Records](https://github.com/JeansCordoba/Colombian_fruits/tree/main/docs/architecture/adr) en el repo.

## Aprendizaje

Para explicaciones en lenguaje sencillo: [Study/Home](Study-Home).
