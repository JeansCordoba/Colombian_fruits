# API — Overview

Resumen del contrato HTTP de la Colombian Fruits API.

## Base URL

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/docs`
- Health: `http://localhost:3000/health` (sin prefijo `api/v1`)

## Envelope de éxito

**Recurso único:**

```json
{
  "success": true,
  "data": { },
  "statusCode": 200
}
```

**Lista paginada:**

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "totalPages": 0
  },
  "statusCode": 200
}
```

## Envelope de error

```json
{
  "statusCode": 404,
  "message": "Family with id 99 not found.",
  "error": "Not Found"
}
```

`message` puede ser `string` o `string[]` (validación de DTOs).

## Paginación

Query params en listados:

- `page` — default `1`
- `limit` — default `20`, máximo `100`
- `search` — opcional en `/fruits`

## Soft delete

`DELETE` en catálogos, families y fruits marca `deleted_at`. Respuesta `204 No Content`.

## Swagger

Documentación interactiva en `/api/docs`. Incluye ejemplos de request/response por endpoint.

## Contrato completo

Ver [endpoints.md](../api/endpoints.md) en el repo.

## Siguiente paso

- [Testing](Testing)
- [Study/04-Patrones-Estructurales](Study/04-Patrones-Estructurales) — DTOs
