# Glosario rápido

Términos clave del proyecto con enlace al código real bajo `src/`.

| Término | Qué es | Archivo de referencia |
|---------|--------|----------------------|
| **DTO** | Contrato HTTP de entrada/salida | `interfaces/http/fruits/dto/` |
| **Puerto** | Interfaz de persistencia en dominio | `domain/fruits/repositories/fruit.repository.port.ts` |
| **Token DI** | Símbolo para inyectar implementación | `domain/fruits/repositories/fruit.repository.token.ts` |
| **Agregado** | Entidad raíz con reglas propias | `domain/fruits/entities/fruit.entity.ts` |
| **Read Model** | Vista enriquecida para lectura | `domain/fruits/read-models/fruit-with-relations.read-model.ts` |
| **Use Case** | Una acción de negocio | `application/fruits/use-cases/create-fruit/` |
| **Command** | Input tipado al use case | `create-fruit.command.ts` |
| **Query** | Input de lectura (list/get) | `list-fruits.query.ts`, `get-fruit-by-id.command.ts` |
| **Mapper** | Traduce ORM ↔ dominio | `infrastructure/persistence/fruits/fruit.mapper.ts` |
| **ORM Entity** | Tabla TypeORM | `infrastructure/persistence/fruits/fruit.orm-entity.ts` |
| **DomainException** | Error de negocio con `kind` | `domain/shared/exceptions/domain-exception.base.ts` |
| **Migración** | Cambio versionado de esquema | `infrastructure/persistence/migrations/` |
| **Soft delete** | Marca `deleted_at` | `@DeleteDateColumn` en ORM entities |
| **Envelope** | Wrapper `{ success, data, statusCode }` | `interfaces/http/shared/http/build-api-success-response.ts` |
| **Paginación** | `page`, `limit`, `meta` | `application/shared/pagination/normalize-pagination.ts` |
| **Seed** | Script para poblar datos iniciales | ⬜ Pendiente (rama `develop`) |

## Rutas HTTP útiles

| Ruta | Propósito |
|------|-----------|
| `GET /health` | ¿API y BD vivos? |
| `GET /api/docs` | Swagger interactivo |
| `POST /api/v1/type-plants` | Primer catálogo a crear |
| `POST /api/v1/fruits` | Agregado principal (requiere catálogos previos) |

## Orden para poblar datos (sin seed)

1. type-plants → type-fruits → climates → departments → natural-regions → harvest-seasons
2. families (necesita `typePlantId`)
3. fruits (necesita family + typeFruit + IDs N:M)

## Siguiente paso

- Volver a [[Study/Home]]
- [[Home]] — wiki principal
