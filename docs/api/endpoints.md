# Contrato API — MVP

Endpoints implementados. Base path: `/api/v1`.

## Convenciones generales

| Aspecto | Convención |
|---------|------------|
| Base URL | `/api/v1` |
| IDs | `integer` (auto-increment) |
| Paginación | `?page=1&limit=20` (default limit: 20, max: 100) |
| Éxito | `{ "success": true, "data": ..., "statusCode": number }` |
| Éxito paginado | Añade `"meta": { total, page, limit, totalPages }` |
| Errores | `{ "statusCode": number, "message": string \| string[], "error": string }` |
| Timestamps | ISO 8601 UTC |
| Naming JSON | `camelCase` |
| DELETE | Soft delete (`deleted_at`) |

## Health check

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/health` | Estado del servicio y conexión BD | No |

**Response 200** (sin envelope — fuera de `api/v1`):

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-06-20T22:00:00.000Z"
}
```

---

## Fruits

### `POST /api/v1/fruits`

Crea una fruta con relaciones N:M.

**Request body:**

```json
{
  "commonName": "Granadilla",
  "scientificName": "Passiflora ligularis",
  "description": "Fruta de la familia Passifloraceae",
  "familyId": 1,
  "typeFruitId": 2,
  "climateIds": [1],
  "departmentIds": [5, 11],
  "naturalRegionIds": [2],
  "harvestSeasonIds": [3]
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "commonName": "Granadilla",
    "scientificName": "Passiflora ligularis",
    "description": "Fruta de la familia Passifloraceae",
    "family": {
      "id": 1,
      "name": "Passifloraceae",
      "typePlant": { "id": 3, "name": "Vine" }
    },
    "typeFruit": { "id": 2, "name": "Berry" },
    "climates": [{ "id": 1, "name": "Tropical" }],
    "departments": [{ "id": 5, "name": "Cundinamarca", "code": "CUN" }],
    "naturalRegions": [{ "id": 2, "name": "Andean" }],
    "harvestSeasons": [{ "id": 3, "startMonth": 1, "endMonth": 12 }],
    "createdAt": "2026-06-20T22:00:00.000Z",
    "updatedAt": "2026-06-20T22:00:00.000Z"
  },
  "statusCode": 201
}
```

**Errores:** `400` (validación), `404` (FK no existe), `409` (scientificName duplicado)

---

### `GET /api/v1/fruits/:id`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "commonName": "Granadilla",
    "scientificName": "Passiflora ligularis",
    "family": {
      "id": 1,
      "name": "Passifloraceae",
      "typePlant": { "id": 3, "name": "Vine" }
    },
    "typeFruit": { "id": 2, "name": "Berry" },
    "climates": [{ "id": 1, "name": "Tropical" }],
    "departments": [{ "id": 5, "name": "Cundinamarca", "code": "CUN" }],
    "naturalRegions": [{ "id": 2, "name": "Andean" }],
    "harvestSeasons": [{ "id": 3, "startMonth": 1, "endMonth": 12 }],
    "createdAt": "2026-06-20T22:00:00.000Z",
    "updatedAt": "2026-06-20T22:00:00.000Z"
  },
  "statusCode": 200
}
```

---

### `GET /api/v1/fruits`

Listado paginado. Query: `page`, `limit`, `search` (opcional).

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "commonName": "Granadilla",
      "scientificName": "Passiflora ligularis",
      "family": { "id": 1, "name": "Passifloraceae" },
      "createdAt": "2026-06-20T22:00:00.000Z"
    }
  ],
  "meta": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 },
  "statusCode": 200
}
```

---

### `PUT /api/v1/fruits/:id`

Actualiza fruta y reemplaza relaciones N:M.

**Response 200:** mismo envelope que GET con `statusCode: 200`.

---

### `DELETE /api/v1/fruits/:id`

Soft delete. **Response 204** sin body.

---

## Catálogos — CRUD

Mismo patrón para: `type-plants`, `type-fruits`, `climates`, `departments`, `natural-regions`, `harvest-seasons`, `families`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/{resource}` | Crear |
| `GET` | `/api/v1/{resource}/:id` | Obtener por ID |
| `GET` | `/api/v1/{resource}` | Listar paginado |
| `PUT` | `/api/v1/{resource}/:id` | Actualizar |
| `DELETE` | `/api/v1/{resource}/:id` | Soft delete (204) |

### Request — `departments`

```json
{
  "name": "Antioquia",
  "code": "ANT"
}
```

`code` se normaliza a mayúsculas (máx. 4 caracteres).

### Request — `families`

```json
{
  "name": "Passifloraceae",
  "typePlantId": 3
}
```

### Response — `families` (envelope)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Passifloraceae",
    "typePlant": { "id": 3, "name": "Vine" },
    "createdAt": "2026-06-20T22:00:00.000Z",
    "updatedAt": "2026-06-20T22:00:00.000Z"
  },
  "statusCode": 200
}
```

### Response — catálogos simples (envelope)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tropical",
    "createdAt": "2026-06-20T22:00:00.000Z",
    "updatedAt": "2026-06-20T22:00:00.000Z"
  },
  "statusCode": 200
}
```

### Response — `departments` (incluye `code`)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Antioquia",
    "code": "ANT",
    "createdAt": "2026-06-20T22:00:00.000Z",
    "updatedAt": "2026-06-20T22:00:00.000Z"
  },
  "statusCode": 200
}
```

**Excepción — `harvest-seasons`:** solo `startMonth` (1–12) y `endMonth` (1–12). Sin campo `name`.

---

## Prioridad de implementación

| Fase | Endpoints | Estado |
|------|-----------|--------|
| MVP vertical slice | `POST/GET /fruits`, `GET /health` | ✅ |
| Catálogos CRUD | 6 recursos + families | ✅ |
| Fruits update/delete | `PUT/DELETE /fruits/:id` | ✅ |
| Filtros avanzados | `?climate=`, `?department=` | ⬜ Pendiente |

## Referencias

- Secuencia CreateFruit: [`../architecture/04-sequence-create-fruit.md`](../architecture/04-sequence-create-fruit.md)
- ERD: [`../database/schema.dbml`](../database/schema.dbml)
