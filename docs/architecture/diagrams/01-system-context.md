# Diagram: System Context

**Type:** Architecture diagram  
**Tool:** Mermaid (`flowchart LR`)  
**Purpose:** Show who interacts with the API, PostgreSQL, Swagger, and health check.

---

## Diagram

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

---

## Notes

- Global API prefix is `api/v1`; `/health` and `/api/docs` sit **outside** that prefix.
- Success responses use envelope `{ success, data, statusCode }`.
- In Docker Compose, the API uses `DATABASE_HOST=postgres`.

## References

- [API endpoints](../../api/endpoints.md)
- [Docker deployment](./05-deployment-docker.md)
