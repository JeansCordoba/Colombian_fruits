# Diagram: API Request Flow

**Type:** Sequence diagram  
**Tool:** Mermaid (`sequenceDiagram`)  
**Purpose:** Generic HTTP request path through Clean Architecture layers.

---

## Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller as Controller (interfaces)
    participant UseCase as Use Case (application)
    participant Port as Repository Port (domain)
    participant Repo as Repository (infrastructure)
    participant DB as PostgreSQL

    Client->>Controller: HTTP request + DTO
    Controller->>Controller: ValidationPipe
    Controller->>UseCase: execute(command)
    UseCase->>Port: port method
    Port->>Repo: DI resolves implementation
    Repo->>DB: SQL query / transaction
    DB-->>Repo: rows
    Repo-->>UseCase: domain entity
    UseCase-->>Controller: result
    Controller->>Controller: buildApiSuccessResponse
    Controller-->>Client: JSON envelope
```

---

## Notes

- Errors from domain throw `DomainException` → `DomainExceptionFilter` maps to HTTP status.
- `GET /health` bypasses the envelope and `api/v1` prefix.
- Concrete example: [Create Fruit sequence](../04-sequence-create-fruit.md).

## References

- [API overview (wiki)](../../wiki/API-Overview.md)
- [Create Fruit flow (wiki)](../../wiki/Create-Fruit-Flow.md)
