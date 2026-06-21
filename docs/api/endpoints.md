# Contrato API — MVP

Endpoints definidos **antes** de implementar controllers. Base path: `/api/v1`.

## Convenciones generales

| Aspecto | Convención |
|---------|------------|
| Base URL | `/api/v1` |
| IDs | `integer` (auto-increment) |
| Paginación | `?page=1&limit=20` (default limit: 20, max: 100) |
| Errores | `{ "statusCode": number, "message": string \| string[], "error": string }` |
| Timestamps | ISO 8601 UTC |
| Naming JSON | `camelCase` |

## Health check

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/health` | Estado del servicio y conexión BD | No |

**Response 200:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-06-20T22:00:00.000Z"
}
```

---

## Fruits — vertical slice MVP

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

**Validaciones:**
- `commonName`: required, string, 1–50 chars
- `scientificName`: required, string, 1–50 chars
- `description`: optional, string
- `familyId`, `typeFruitId`: required, integer, must exist
- `climateIds`, `departmentIds`, `naturalRegionIds`, `harvestSeasonIds`: optional, array of integers, each must exist

> `TypePlant` se obtiene indirectamente vía `family.typePlantId` — no se envía en el request.

**Response 201:** `FruitResponseDto` (ver abajo)

**Errores:** `400` (validación), `404` (FK no existe), `409` (scientificName duplicado)

---

### `GET /api/v1/fruits/:id`

Obtiene una fruta por ID con relaciones anidadas.

**Response 200:**
```json
{
  "id": 1,
  "commonName": "Granadilla",
  "scientificName": "Passiflora ligularis",
  "description": "Fruta de la familia Passifloraceae",
  "family": {
    "id": 1,
    "name": "Passifloraceae",
    "typePlant": { "id": 3, "name": "Vine" }
  },
  "typeFruit": {
    "id": 2,
    "name": "Berry"
  },
  "climates": [
    { "id": 1, "name": "Tropical" }
  ],
  "departments": [
    { "id": 5, "name": "Cundinamarca" }
  ],
  "naturalRegions": [
    { "id": 2, "name": "Andean" }
  ],
  "harvestSeasons": [
    { "id": 3, "startMonth": 1, "endMonth": 12 }
  ],
  "createdAt": "2026-06-20T22:00:00.000Z",
  "updatedAt": "2026-06-20T22:00:00.000Z"
}
```

**Errores:** `404` (fruta no encontrada)

---

### `GET /api/v1/fruits`

Listado paginado de frutas.

**Query params:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `search` (optional) — busca en `commonName` y `scientificName`

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "commonName": "Granadilla",
      "scientificName": "Passiflora ligularis",
      "family": { "id": 1, "name": "Passifloraceae" },
      "createdAt": "2026-06-20T22:00:00.000Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

## Catálogos — CRUD básico (fase 2)

Mismo patrón para todos los recursos de catálogo. Ejemplo con `families`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/families` | Crear familia |
| `GET` | `/api/v1/families/:id` | Obtener por ID |
| `GET` | `/api/v1/families` | Listar paginado |
| `PUT` | `/api/v1/families/:id` | Actualizar |
| `DELETE` | `/api/v1/families/:id` | Eliminar |

Recursos con el mismo patrón:

- `/api/v1/type-plants`
- `/api/v1/type-fruits`
- `/api/v1/climates`
- `/api/v1/departments`
- `/api/v1/natural-regions`
- `/api/v1/harvest-seasons`

### Request body — `families`

```json
{
  "name": "Passifloraceae",
  "typePlantId": 3
}
```

### Request body — catálogos simples (`type-plants`, `type-fruits`, `climates`, `departments`, `natural-regions`)

```json
{
  "name": "Tropical"
}
```

### Response — `families`

```json
{
  "id": 1,
  "name": "Passifloraceae",
  "typePlant": { "id": 3, "name": "Vine" },
  "createdAt": "2026-06-20T22:00:00.000Z",
  "updatedAt": "2026-06-20T22:00:00.000Z"
}
```

### Response genérico — catálogos simples

```json
{
  "id": 1,
  "name": "Tropical",
  "createdAt": "2026-06-20T22:00:00.000Z",
  "updatedAt": "2026-06-20T22:00:00.000Z"
}
```

**Excepción — `harvest-seasons`:** solo incluye `startMonth` (1–12) y `endMonth` (1–12). No tiene campo `name`.

---

## Prioridad de implementación

| Fase | Endpoints | Estado |
|------|-----------|--------|
| **MVP (vertical slice)** | `POST /fruits`, `GET /fruits/:id`, `GET /fruits`, `GET /health` | Por implementar |
| **Fase 2** | CRUD catálogos (families, climates, etc.) | Por implementar |
| **Fase 3** | `PUT /fruits/:id`, `DELETE /fruits/:id` | Por implementar |
| **Fase 4** | Filtros avanzados (`?climate=`, `?department=`) | Por implementar |

## Referencias

- Secuencia CreateFruit: [`../architecture/04-sequence-create-fruit.md`](../architecture/04-sequence-create-fruit.md)
- ERD: [`../database/schema.dbml`](../database/schema.dbml)
- Guía vertical slice: [`../guides/01-vertical-slice-fruits.md`](../guides/01-vertical-slice-fruits.md)
