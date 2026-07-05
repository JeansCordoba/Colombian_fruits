# Secuencia — CreateFruit

Flujo completo del caso de uso `CreateFruit`, incluyendo validación de FKs N:M, `FruitRelationsValidator`, re-fetch post-create y envelope de respuesta.

## Participantes

| Participante | Capa | Responsabilidad |
|--------------|------|-----------------|
| `Client` | Externo | Envía POST con datos de la fruta |
| `FruitsController` | interfaces | Valida DTO, delega al use case, re-fetch, envelope |
| `CreateFruitUseCase` | application | Orquesta reglas, valida FKs, persiste |
| `FruitRelationsValidator` | application | Valida que IDs N:M existen |
| `GetFruitByIdUseCase` | application | Re-fetch con `FruitWithRelations` post-create |
| `FruitRepositoryPort` | domain | Contrato de persistencia |
| `FruitRepository` | infrastructure | TypeORM + transacción N:M |
| `PostgreSQL` | infrastructure | Almacenamiento |

## Diagrama de secuencia

```mermaid
sequenceDiagram
    participant Client
    participant Controller as FruitsController
    participant CreateUC as CreateFruitUseCase
    participant Validator as FruitRelationsValidator
    participant GetUC as GetFruitByIdUseCase
    participant FamilyRepo as FamilyRepositoryPort
    participant TypeFruitRepo as TypeFruitRepositoryPort
    participant FruitRepo as FruitRepositoryPort
    participant PGRepo as FruitRepository
    participant DB as PostgreSQL

    Client->>Controller: POST /api/v1/fruits
    Controller->>Controller: ValidationPipe (DTO)
    Controller->>CreateUC: execute(CreateFruitCommand)
    CreateUC->>FamilyRepo: findById(familyId)
    FamilyRepo-->>CreateUC: Family | null
    alt family not found
        CreateUC-->>Controller: FamilyNotFoundException
    end
    CreateUC->>TypeFruitRepo: findById(typeFruitId)
    TypeFruitRepo-->>CreateUC: TypeFruit | null
    CreateUC->>CreateUC: check scientificName unique
    CreateUC->>Validator: validate(relations)
    Validator-->>CreateUC: OK
    CreateUC->>FruitRepo: save(fruit, relations)
    FruitRepo->>PGRepo: DI resolves implementation
    PGRepo->>DB: BEGIN + INSERT fruits + bridge rows
    PGRepo->>DB: COMMIT
    PGRepo-->>CreateUC: Fruit
    CreateUC-->>Controller: saved Fruit
    Controller->>GetUC: execute(GetFruitByIdCommand)
    GetUC->>FruitRepo: findByIdWithRelations(id)
    FruitRepo-->>GetUC: FruitWithRelations
    GetUC-->>Controller: FruitWithRelations
    Controller->>Controller: buildApiSuccessResponse
    Controller-->>Client: 201 { success, data, statusCode }
```

## Flujo paso a paso

### 1. Entrada HTTP (`interfaces/`)

`FruitsController` usa `@Controller('fruits')`; el prefijo global `api/v1` se aplica en `main.ts`. Tras crear, el controller **re-fetch** con `GetFruitByIdUseCase` para devolver relaciones anidadas y envuelve con `buildApiSuccessResponse`.

### 2. Caso de uso (`application/`)

`CreateFruitUseCase.execute(command)`:

1. Verifica `familyId` y `typeFruitId` existen (lanza excepciones de dominio si no).
2. Verifica `scientificName` no duplicado.
3. Delega validación N:M a `FruitRelationsValidator.validate(relations)`.
4. Construye entidad `Fruit` y persiste vía `FruitRepositoryPort.save()`.

### 3. Persistencia (`infrastructure/`)

`FruitRepository.save()` abre transacción TypeORM, inserta fruta y tablas puente, commit/rollback.

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
| `400` | DTO inválido | `ValidationPipe` en `interfaces/` |
| `404` | FK no existe | Use case / validator → `DomainException` (`NOT_FOUND`) |
| `409` | `scientificName` duplicado | `DuplicateFruitScientificNameException` |
| `422` | Regla de dominio incumplida | `InvalidFruitDataException` |

## Archivos involucrados

```
src/interfaces/http/fruits/fruits.controller.ts
src/application/fruits/use-cases/create-fruit/create-fruit.use-case.ts
src/application/fruits/services/fruit-relations.validator.ts
src/application/fruits/use-cases/get-fruit-by-id/get-fruit-by-id.use-case.ts
src/infrastructure/persistence/fruits/fruit.repository.ts
src/interfaces/http/shared/filters/domain-exception.filter.ts
```

## Referencias

- Contrato API: [`../api/endpoints.md`](../api/endpoints.md)
- Patrones: [`05-design-patterns.md`](./05-design-patterns.md)
- Excepciones: [`06-domain-exceptions.md`](./06-domain-exceptions.md)
