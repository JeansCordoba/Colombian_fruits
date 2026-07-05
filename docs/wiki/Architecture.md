# Arquitectura

Resumen de la arquitectura del proyecto. Para profundizar, consulta la [documentación técnica en el repositorio](https://github.com/JeansCordoba/Colombian_fruits/tree/main/docs/architecture).

## Clean Architecture + layer-first

```
interfaces → application → domain ← infrastructure
```

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Domain | `src/domain/` | Entidades, puertos, excepciones (`DomainException`) |
| Application | `src/application/` | Use cases, validadores |
| Infrastructure | `src/infrastructure/` | TypeORM, config, migraciones |
| Interfaces | `src/interfaces/` | Controllers, DTOs, filtros HTTP |

## Contexto del sistema

```mermaid
flowchart LR
    Client["HTTP Client<br/>(Frontend / Postman)"]
    API["Colombian Fruits API<br/>NestJS"]
    DB[(PostgreSQL 16)]
    Swagger["Swagger UI<br/>/api/docs"]
    Health["Health check<br/>/health"]

    Client -->|"REST /api/v1/*"| API
    Client --> Swagger
    Client --> Health
    API --> DB
    Swagger -.->|"Documents"| API
    Health -.->|"SELECT 1"| DB
```

[Ver fuente en repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/01-system-context.md)

## Capas y dependencias

```mermaid
flowchart TB
    subgraph interfaces ["interfaces/"]
        Controllers["Controllers + DTOs"]
        Filters["Exception filters"]
    end

    subgraph application ["application/"]
        UseCases["Use cases"]
        Validators["Validators / services"]
    end

    subgraph domain ["domain/"]
        Entities["Entities"]
        Ports["Repository ports"]
        Exceptions["Domain exceptions"]
    end

    subgraph infrastructure ["infrastructure/"]
        Repos["Repository implementations"]
        ORM["TypeORM entities + mappers"]
        Config["Config + migrations"]
    end

    Controllers --> UseCases
    UseCases --> Ports
    UseCases --> Entities
    Repos -.->|implements| Ports
    Repos --> ORM
    Filters --> Exceptions
```

[Ver fuente en repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/02-clean-architecture-layers.md)

## Módulos NestJS

```mermaid
flowchart TB
    AppModule["AppModule"]
    ConfigModule["ConfigModule"]
    DatabaseModule["DatabaseModule"]
    HealthModule["HealthModule"]
    CatalogModules["Catalog modules<br/>(departments, climates, ...)"]
    FamiliesModule["FamiliesModule"]
    FruitsModule["FruitsModule"]

    AppModule --> ConfigModule
    AppModule --> DatabaseModule
    AppModule --> HealthModule
    AppModule --> CatalogModules
    AppModule --> FamiliesModule
    AppModule --> FruitsModule
    FruitsModule -->|"imports + FAMILY_REPOSITORY"| FamiliesModule
```

[Ver fuente en repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/04-nestjs-modules.md)

## Flujo de ejemplo: Create Fruit

Diagrama de secuencia del caso de uso principal: [[Create-Fruit-Flow]].

## Más diagramas (en el repositorio)

| Diagrama | Tema | Enlace |
|----------|------|--------|
| 03-entity-relationship | ERD | [Ver en repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/03-entity-relationship.md) |
| 05-deployment-docker | Docker Compose | [Ver en repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/05-deployment-docker.md) |
| 06-git-branching | Ramas Git | [Ver en repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/06-git-branching.md) |
| 07-installation-flow | Instalación local | [Ver en repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/07-installation-flow.md) |
| 08-migration-flow | Migraciones | [Ver en repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/08-migration-flow.md) |
| 09-api-request-flow | Request HTTP genérico | [Ver en repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/09-api-request-flow.md) |

## Bounded contexts

- **Catálogos:** departments, climates, type-plants, type-fruits, natural-regions, harvest-seasons
- **Families:** familias botánicas ligadas a type-plants
- **Fruits:** agregado principal con relaciones N:M

## ADRs

Decisiones arquitectónicas: [docs/architecture/adr/](https://github.com/JeansCordoba/Colombian_fruits/tree/main/docs/architecture/adr).

## Aprendizaje

Para explicaciones en lenguaje sencillo: [[Study-Home]].
