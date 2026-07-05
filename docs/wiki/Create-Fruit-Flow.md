# Flujo Create Fruit

Secuencia completa del caso de uso `CreateFruit`: validación de DTO, FKs N:M, persistencia transaccional y re-fetch con envelope de respuesta.

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

## Participantes

| Participante | Capa | Responsabilidad |
|--------------|------|-----------------|
| `FruitsController` | interfaces | Valida DTO, delega al use case, re-fetch, envelope |
| `CreateFruitUseCase` | application | Orquesta reglas, valida FKs, persiste |
| `FruitRelationsValidator` | application | Valida que IDs N:M existen |
| `GetFruitByIdUseCase` | application | Re-fetch con relaciones post-create |
| `FruitRepositoryPort` | domain | Contrato de persistencia |
| `FruitRepository` | infrastructure | TypeORM + transacción N:M |

## Errores esperados

| Código | Condición |
|--------|-----------|
| `400` | DTO inválido (`ValidationPipe`) |
| `404` | FK no existe |
| `409` | `scientificName` duplicado |
| `422` | Regla de dominio incumplida |

## Ver fuente / profundizar

- [Secuencia CreateFruit en el repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/04-sequence-create-fruit.md)
- [[Architecture]] — capas y módulos
- [[API-Overview]] — envelope HTTP
