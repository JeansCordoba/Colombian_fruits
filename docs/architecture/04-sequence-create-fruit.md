# Secuencia — CreateFruit

Flujo completo del caso de uso `CreateFruit`, incluyendo validación de FKs N:M, `FruitRelationsValidator`, re-fetch post-create y envelope de respuesta.

## Participantes

| Participante | Capa | Responsabilidad |
|--------------|------|-----------------|
| `Client` | Externo | Envía POST con datos de la fruta |
| `FruitsController` | interfaces | Valida DTO, delega al use case, re-fetch, envelope |
| `CreateFruitUseCase` | application | Orquesta reglas, valida FKs, persiste |
| `FruitRelationsValidator` | application | Valida que IDs N:M existen |
| `GetFruitByIdUseCase` | application | Re-fetch con relaciones anidadas post-create |
| `FruitRepositoryPort` | domain | Contrato de persistencia |
| `FruitRepository` | infrastructure | Implementación TypeORM + transacción N:M |
| `FamilyRepositoryPort` | domain | Verificar que `familyId` existe |
| `PostgreSQL` | infrastructure | Almacenamiento |

## Diagrama de secuencia

```mermaid
sequenceDiagram
    participant Client
    participant Controller as FruitsController<br/>(interfaces)
    participant CreateUC as CreateFruitUseCase<br/>(application)
    participant Validator as FruitRelationsValidator<br/>(application)
    participant GetUC as GetFruitByIdUseCase<br/>(application)
    participant FamilyRepo as FamilyRepositoryPort<br/>(domain)
    participant FruitRepo as FruitRepositoryPort<br/>(domain)
    participant PGRepo as FruitRepository<br/>(infrastructure)
    participant DB as PostgreSQL

    Client->>Controller: POST /api/v1/fruits<br/>CreateFruitRequestDto
    Controller->>Controller: Validate DTO (class-validator)
    Controller->>CreateUC: execute(CreateFruitCommand)
    CreateUC->>FamilyRepo: findById(familyId)
    FamilyRepo-->>CreateUC: Family
    CreateUC->>CreateUC: Check typeFruit, scientificName unique
    CreateUC->>Validator: validate(relations)
    Validator-->>CreateUC: OK
    CreateUC->>FruitRepo: save(fruit, relations)
    FruitRepo->>PGRepo: (DI resolves implementation)
    PGRepo->>DB: BEGIN TRANSACTION
    PGRepo->>DB: INSERT INTO fruits (...)
    PGRepo->>DB: INSERT INTO fruit_climates (...)
    PGRepo->>DB: COMMIT
    PGRepo-->>CreateUC: Fruit (domain entity)
    CreateUC-->>Controller: saved Fruit
    Controller->>GetUC: execute(GetFruitByIdCommand)
    GetUC->>FruitRepo: findWithRelationsById(id)
    FruitRepo-->>GetUC: FruitWithRelations
    GetUC-->>Controller: FruitWithRelations
    Controller->>Controller: buildApiSuccessResponse(FruitResponseDto)
    Controller-->>Client: 201 { success, data, statusCode }
```

## Flujo paso a paso

### 1. Entrada HTTP (`interfaces/`)

El controller valida el DTO, ejecuta `CreateFruitUseCase`, luego **re-fetch** con `GetFruitByIdUseCase` para devolver relaciones anidadas completas, y envuelve en `{ success, data, statusCode }`.

### 2. Caso de uso (`application/`)

`CreateFruitUseCase.execute(command)`:

1. Verifica `familyId` y `typeFruitId` existen.
2. Verifica `scientificName` no duplicado.
3. Delega validación N:M a `FruitRelationsValidator.validate(relations)`.
4. Construye entidad `Fruit` y persiste vía `FruitRepositoryPort.save()`.

### 3. Persistencia (`infrastructure/`)

`FruitRepository.save()` abre transacción, inserta fruta y tablas puente, commit/rollback.

### 4. Respuesta HTTP (envelope)

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
    "createdAt": "2026-06-20T22:00:00.000Z",
    "updatedAt": "2026-06-20T22:00:00.000Z"
  },
  "statusCode": 201
}
```

## Errores esperados

| Código | Condición | Origen |
|--------|-----------|--------|
| `400 Bad Request` | DTO inválido | `interfaces/` (ValidationPipe) |
| `404 Not Found` | FK no existe | `application/` → excepción de dominio |
| `409 Conflict` | `scientificName` duplicado | `DuplicateFruitScientificNameException` |
| `422 Unprocessable Entity` | Regla de dominio incumplida | `InvalidFruitDataException` |

## Archivos involucrados

```
interfaces/http/fruits/fruits.controller.ts
application/fruits/use-cases/create-fruit/create-fruit.use-case.ts
application/fruits/services/fruit-relations.validator.ts
application/fruits/use-cases/get-fruit-by-id/get-fruit-by-id.use-case.ts
infrastructure/persistence/fruits/fruit.repository.ts
```

## Referencias

- Contrato API: [`../api/endpoints.md`](../api/endpoints.md)
- Patrones: [`05-design-patterns.md`](./05-design-patterns.md)
