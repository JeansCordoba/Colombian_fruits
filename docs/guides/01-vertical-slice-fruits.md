# Guía — Vertical slice: Fruits

Implementación paso a paso del primer flujo completo (`CreateFruit` + `GetFruitById`) siguiendo la estructura **layer-first**.

## Objetivo

Practicar estos patrones en un flujo real de punta a punta:

- Repository (puerto + implementación)
- Use Case (una acción = una clase)
- Command (input tipado)
- DTO (contrato HTTP)
- Mapper (domain ↔ ORM)
- Dependency Injection (wiring NestJS)

## Prerrequisitos

- Checklist completado: [`00-project-kickoff-checklist.md`](./00-project-kickoff-checklist.md)
- Tooling TypeScript configurado: `tsconfig.json`, `pnpm run typecheck` (ver [`02-implementation-status.md`](./02-implementation-status.md))
- PostgreSQL corriendo via Docker Compose (cuando llegues a infrastructure)
- ERD revisado: [`../database/schema.dbml`](../database/schema.dbml)

## Orden de implementación

Implementa **de adentro hacia afuera**: domain → application → infrastructure → interfaces.

---

### Paso 1 — Domain (`domain/fruits/`)

#### 1.1 Entidad de dominio

**Archivo:** `domain/fruits/entities/fruit.entity.ts`

```typescript
export class Fruit {
  constructor(
    readonly id: number,
    readonly commonName: string,
    readonly scientificName: string,
    readonly description: string | null,
    readonly familyId: number,
    readonly typeFruitId: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
```

Reglas:
- Sin decoradores NestJS ni TypeORM.
- Propiedades `readonly`.
- Sin lógica de persistencia.

#### 1.2 Puerto del repositorio

**Archivo:** `domain/fruits/repositories/fruit.repository.port.ts`

```typescript
export interface FruitRelations {
  climateIds: number[];
  departmentIds: number[];
  naturalRegionIds: number[];
  harvestSeasonIds: number[];
}

export interface FruitRepositoryPort {
  save(fruit: Fruit, relations: FruitRelations): Promise<Fruit>;
  findById(id: number): Promise<Fruit | null>;
  findByScientificName(scientificName: string): Promise<Fruit | null>;
  findAll(): Promise<Fruit[]>;
}
```

#### 1.3 Token de inyección

**Archivo:** `domain/fruits/repositories/fruit.repository.token.ts`

```typescript
export const FRUIT_REPOSITORY = Symbol('FRUIT_REPOSITORY');
```

El token permite inyectar la interface `FruitRepositoryPort` en NestJS porque las interfaces no existen en runtime.

#### 1.4 Excepciones de dominio

**Archivo:** `domain/fruits/exceptions/fruit.exceptions.ts`

Agrupa **todas** las excepciones del contexto `fruits` en un solo archivo:

```typescript
export class FruitNotFoundException extends Error { /* ... */ }
export class FruitScientificNameNotFoundException extends Error { /* ... */ }
export class DuplicateFruitScientificNameException extends Error { /* ... */ }
export class InvalidFruitDataException extends Error { /* ... */ }
```

| Excepción | Use case que la lanza | HTTP (filter) |
|-----------|----------------------|---------------|
| `FruitNotFoundException` | `GetFruitByIdUseCase` | 404 |
| `DuplicateFruitScientificNameException` | `CreateFruitUseCase` / repositorio | 409 |
| `InvalidFruitDataException` | `CreateFruitUseCase` | 422 |
| `FruitScientificNameNotFoundException` | use cases que buscan por nombre científico | 404 |

Convención completa: [`../architecture/06-domain-exceptions.md`](../architecture/06-domain-exceptions.md)

**Estado:** ✅ implementado en `src/domain/fruits/exceptions/fruit.exceptions.ts`

---

### Paso 2 — Application (`application/fruits/`)

#### 2.1 Command

**Archivo:** `application/fruits/use-cases/create-fruit/create-fruit.command.ts`

Input tipado al use case. No es un DTO HTTP.

#### 2.2 CreateFruitUseCase

**Archivo:** `application/fruits/use-cases/create-fruit/create-fruit.use-case.ts`

Responsabilidades:
1. Validar que FKs existen (`familyId`, `typeFruitId`).
2. Construir entidad `Fruit`.
3. Llamar a `FruitRepositoryPort.save()`.
4. Retornar entidad persistida.

Un método público: `execute(command: CreateFruitCommand): Promise<Fruit>`.

#### 2.3 GetFruitByIdUseCase

**Archivo:** `application/fruits/use-cases/get-fruit-by-id/get-fruit-by-id.use-case.ts`

Responsabilidades:
1. Llamar a `FruitRepositoryPort.findById()`.
2. Lanzar `FruitNotFoundException` si no existe.
3. Retornar entidad.

#### 2.4 Test unitario

**Archivo:** `application/fruits/use-cases/create-fruit/create-fruit.use-case.spec.ts`

- Mock de `FruitRepositoryPort`.
- Verificar que `execute()` llama al repositorio con los datos correctos.
- Verificar excepción cuando FK no existe.

---

### Paso 3 — Infrastructure (`infrastructure/persistence/fruits/`)

#### 3.1 Entidad TypeORM

**Archivo:** `infrastructure/persistence/fruits/fruit.orm-entity.ts`

- `@Entity('fruits')`
- Columnas en snake_case mapeadas a camelCase.
- Relaciones `@ManyToOne` hacia catálogos.
- **No** contiene lógica de negocio.

#### 3.2 Mapper

**Archivo:** `infrastructure/persistence/fruits/fruit.mapper.ts`

```typescript
export class FruitMapper {
  static toDomain(orm: FruitOrmEntity): Fruit { /* ... */ }
  static toPersistence(domain: Fruit): FruitOrmEntity { /* ... */ }
}
```

#### 3.3 Repositorio Postgres

**Archivo:** `infrastructure/persistence/fruits/postgres-fruit.repository.ts`

- Implementa `FruitRepositoryPort`.
- `save()`: transacción → INSERT fruit → INSERT bridge tables → COMMIT.
- `findById()`: query con joins para relaciones anidadas.

#### 3.4 DatabaseModule

**Archivo:** `infrastructure/persistence/database.module.ts`

- Configura TypeORM con PostgreSQL.
- Registra entidades ORM.

---

### Paso 4 — Interfaces (`interfaces/http/fruits/`)

#### 4.1 Request DTO

**Archivo:** `interfaces/http/fruits/dto/create-fruit.request.dto.ts`

- Decoradores `class-validator` (`@IsString`, `@IsInt`, `@IsOptional`).
- Validación automática via `ValidationPipe` global.

#### 4.2 Response DTO

**Archivo:** `interfaces/http/fruits/dto/fruit.response.dto.ts`

- Representa la respuesta HTTP con relaciones anidadas.
- No expone entidad de dominio ni ORM.

#### 4.3 Controller

**Archivo:** `interfaces/http/fruits/fruits.controller.ts`

```typescript
@Controller('api/v1/fruits')
export class FruitsController {
  @Post()
  async create(@Body() dto: CreateFruitRequestDto): Promise<FruitResponseDto> {
    const command = this.toCommand(dto);
    const fruit = await this.createFruitUseCase.execute(command);
    return this.toResponse(fruit);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<FruitResponseDto> {
    const fruit = await this.getFruitByIdUseCase.execute({ id });
    return this.toResponse(fruit);
  }
}
```

El controller **solo adapta**: DTO → Command → UseCase → Response DTO.

#### 4.4 Exception filter

**Archivo:** `interfaces/http/filters/domain-exception.filter.ts`

Traduce excepciones de dominio a códigos HTTP. El controller y los use cases **no** usan `NotFoundException` de NestJS.

#### 4.5 Wiring en AppModule

**Archivo:** `interfaces/app.module.ts`

Registrar providers, controllers, token del repositorio y filter global.

---

### Paso 5 — Migración y seed

1. Generar migración TypeORM para tablas `fruits` + bridge tables.
2. Ejecutar migración contra PostgreSQL local.
3. Crear seed con 3–5 frutas colombianas de ejemplo (granadilla, lulo, guanábana, uchuva, borojó).

---

### Paso 6 — Verificación manual

```bash
# Health check
curl http://localhost:3000/health

# Crear fruta
curl -X POST http://localhost:3000/api/v1/fruits \
  -H "Content-Type: application/json" \
  -d '{ "commonName": "Granadilla", ... }'

# Obtener por ID
curl http://localhost:3000/api/v1/fruits/{id}
```

---

## Estructura final esperada

```
src/
├── domain/fruits/
│   ├── entities/fruit.entity.ts
│   ├── repositories/
│   │   ├── fruit.repository.port.ts
│   │   └── fruit.repository.token.ts
│   └── exceptions/fruit.exceptions.ts
├── application/fruits/use-cases/
│   ├── create-fruit/
│   │   ├── create-fruit.command.ts
│   │   ├── create-fruit.use-case.ts
│   │   └── create-fruit.use-case.spec.ts
│   └── get-fruit-by-id/
│       ├── get-fruit-by-id.query.ts
│       └── get-fruit-by-id.use-case.ts
├── infrastructure/persistence/fruits/
│   ├── fruit.orm-entity.ts
│   ├── fruit.mapper.ts
│   └── postgres-fruit.repository.ts
└── interfaces/http/fruits/
    ├── fruits.controller.ts
    └── dto/
        ├── create-fruit.request.dto.ts
        └── fruit.response.dto.ts
```

## Errores comunes a evitar

| Error | Corrección |
|-------|------------|
| Poner `@Entity` en `domain/` | ORM entity solo en `infrastructure/` |
| Use case recibe DTO HTTP | Usar Command como input |
| Controller con lógica de negocio | Delegar todo al use case |
| Exponer `FruitOrmEntity` en response | Mapear a `FruitResponseDto` |
| `NotFoundException` en controller | Lanzar excepción de dominio; filter en `interfaces/` |
| Inserts N:M sin transacción | Usar QueryRunner con BEGIN/COMMIT |

## Referencias

- Secuencia: [`../architecture/04-sequence-create-fruit.md`](../architecture/04-sequence-create-fruit.md)
- Patrones: [`../architecture/05-design-patterns.md`](../architecture/05-design-patterns.md)
- API contract: [`../api/endpoints.md`](../api/endpoints.md)
- Excepciones: [`../architecture/06-domain-exceptions.md`](../architecture/06-domain-exceptions.md)
- Estado del código: [`02-implementation-status.md`](./02-implementation-status.md)
