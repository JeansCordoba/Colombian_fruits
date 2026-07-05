# Diagram: Clean Architecture Layers

**Type:** Architecture diagram  
**Tool:** Mermaid (`flowchart TB`)  
**Purpose:** Illustrate layer-first folders and the dependency rule.

---

## Diagram

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

---

## Dependency rule

```
interfaces → application → domain ← infrastructure
```

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| Domain | `src/domain/` | Pure business model, ports, exceptions |
| Application | `src/application/` | Use cases; depends only on domain ports |
| Infrastructure | `src/infrastructure/` | TypeORM, config, migrations |
| Interfaces | `src/interfaces/` | HTTP adapters, DTOs, NestJS modules |

## References

- [Clean Architecture layers](../02-clean-architecture-layers.md)
- [Layer-first structure](../03-layer-first-structure.md)
