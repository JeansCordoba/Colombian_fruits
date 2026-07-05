# Glosario rápido

Términos clave del proyecto con enlace al código.

| Término | Qué es | Archivo de referencia |
|---------|--------|---------------------|
| **DTO** | Contrato HTTP de entrada/salida | `interfaces/http/fruits/dto/` |
| **Puerto** | Interfaz de persistencia en dominio | `domain/fruits/repositories/fruit.repository.port.ts` |
| **Token DI** | Símbolo para inyectar implementación | `domain/fruits/repositories/fruit.repository.token.ts` |
| **Agregado** | Entidad raíz con reglas propias | `domain/fruits/entities/fruit.entity.ts` |
| **Read Model** | Vista enriquecida para lectura | `domain/fruits/read-models/fruit-with-relations.read-model.ts` |
| **Use Case** | Una acción de negocio | `application/fruits/use-cases/create-fruit/` |
| **Command** | Input tipado al use case | `create-fruit.command.ts` |
| **Mapper** | Traduce ORM ↔ dominio | `infrastructure/persistence/fruits/fruit.mapper.ts` |
| **Migración** | Cambio versionado de esquema BD | `infrastructure/persistence/migrations/` |
| **Soft delete** | Marca `deleted_at` sin borrar fila | `@DeleteDateColumn` en ORM entities |
| **Envelope** | Wrapper `{ success, data, statusCode }` | `interfaces/http/shared/http/build-api-success-response.ts` |
| **Seed** | Script para poblar datos iniciales | ⬜ Pendiente (usuario, rama `develop`) |

## Siguiente paso

- Volver a [Study/Home](Study-Home)
- [Wiki Home](Home)
