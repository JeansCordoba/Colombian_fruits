# Arquitectura de software

## ¿Qué es la arquitectura?

La **arquitectura** define cómo se organizan las partes de un sistema y **qué capa puede importar a cuál**. No es solo “carpetas bonitas”: son reglas que protegen el núcleo del negocio.

## Analogía cotidiana

Un edificio: la estructura (vigas = dominio) no depende de la pintura (HTTP = interfaces). Si cambias la pintura, el edificio no se cae. Si la estructura dependiera de la pintura, cualquier cambio de color derrumbaría todo.

## Regla de oro de este proyecto

```
interfaces → application → domain ← infrastructure
```

| Capa | Pregunta que responde |
|------|----------------------|
| `domain/` | ¿Qué es una fruta? ¿Qué puede hacer el repositorio (contrato)? |
| `application/` | ¿Cómo creo una fruta validando FKs? |
| `infrastructure/` | ¿Cómo guardo en PostgreSQL con TypeORM? |
| `interfaces/` | ¿Cómo llega el JSON por HTTP? |

## Ejemplo real — puerto vs implementación

**Puerto (dominio — sin TypeORM):**

`src/domain/fruits/repositories/fruit.repository.port.ts`

```typescript
export interface FruitRepositoryPort {
    save(fruit: Fruit, relations: FruitRelations): Promise<Fruit>;
    findByIdWithRelations(id: number): Promise<FruitWithRelations | null>;
    softDelete(id: number): Promise<void>;
}
```

**Implementación (infraestructura — con TypeORM):**

`src/infrastructure/persistence/fruits/fruit.repository.ts`

```typescript
@Injectable()
export class FruitRepository implements FruitRepositoryPort {
    // usa QueryRunner, FruitOrmEntity, FruitMapper...
}
```

El use case **solo conoce** `FruitRepositoryPort`. No sabe si los datos están en PostgreSQL, MongoDB o memoria.

## Layer-first vs module-first

Este repo usa **layer-first**: primero ves `domain/`, luego `application/`, etc. Cada bounded context (`fruits`, `families`) es una subcarpeta **dentro** de cada capa.

Alternativa (no usada aquí): **module-first** → `modules/fruits/domain/`, `modules/fruits/application/`… Más común en NestJS, menos didáctico para aprender capas.

## Errores comunes

1. **Importar TypeORM en `domain/`** — el dominio queda acoplado a la BD.
2. **Controller llamando al repository directo** — saltas la capa application.
3. **DTO con lógica de negocio** — los DTOs solo validan formato HTTP (`@IsString`, etc.).

## Diagrama rápido

Ver en el repo: [Clean Architecture layers](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/diagrams/02-clean-architecture-layers.md)

## Siguiente paso

- [[Study/03-Patrones-Creacionales]]
- Profundizar: [Capas detalladas](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/02-clean-architecture-layers.md)
