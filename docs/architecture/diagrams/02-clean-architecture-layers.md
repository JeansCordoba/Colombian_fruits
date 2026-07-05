# Diagrama — Capas Clean Architecture

Regla de dependencia: las capas externas dependen de las internas; el dominio no conoce infraestructura ni HTTP.

```mermaid
flowchart TB
    subgraph interfaces ["interfaces/"]
        Controllers["Controllers + DTOs"]
        Filters["Exception Filters"]
    end

    subgraph application ["application/"]
        UseCases["Use Cases"]
        Validators["Validators / Services"]
    end

    subgraph domain ["domain/"]
        Entities["Entities"]
        Ports["Repository Ports"]
        Exceptions["Domain Exceptions"]
    end

    subgraph infrastructure ["infrastructure/"]
        Repos["Repository Implementations"]
        ORM["TypeORM Entities + Mappers"]
        Config["Config + Migrations"]
    end

    Controllers --> UseCases
    UseCases --> Ports
    UseCases --> Entities
    Repos -.->|implements| Ports
    Repos --> ORM
    Filters --> Exceptions
```

## Regla de dependencia

```
interfaces → application → domain ← infrastructure
```

- **domain/** — lógica pura, sin NestJS ni TypeORM.
- **application/** — orquesta casos de uso; depende solo de puertos del dominio.
- **infrastructure/** — implementa puertos (TypeORM, config).
- **interfaces/** — adaptadores HTTP; convierte DTOs ↔ Commands/Queries.

## Referencias

- [Capas detalladas](../02-clean-architecture-layers.md)
- [Estructura layer-first](../03-layer-first-structure.md)
