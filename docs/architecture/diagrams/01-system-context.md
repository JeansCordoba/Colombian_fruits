# Diagrama — Contexto del sistema

Vista de alto nivel: quién interactúa con qué.

```mermaid
flowchart LR
    Client["Cliente HTTP<br/>(Frontend / Postman)"]
    API["Colombian Fruits API<br/>NestJS"]
    DB[(PostgreSQL 16)]
    Swagger["Swagger UI<br/>/api/docs"]
    Health["Health check<br/>/health"]

    Client -->|"REST /api/v1/*"| API
    Client --> Swagger
    Client --> Health
    API --> DB
    Swagger -.->|"Documenta"| API
    Health -.->|"Ping SELECT 1"| DB
```

## Notas

- El prefijo global es `api/v1`; `/health` y `/api/docs` quedan **fuera** del prefijo.
- Swagger documenta el contrato con envelope `{ success, data, statusCode }`.
- En Docker, PostgreSQL corre como servicio `postgres`; la API espera `DATABASE_HOST=postgres`.

## Referencias

- [Endpoints](../../api/endpoints.md)
- [Deployment Docker](./05-deployment-docker.md)
