# Patrones de diseño

Matriz de patrones con ejemplos concretos del dominio `Fruit`, cuándo aplicarlos y anti-patrones a evitar.

## Matriz de patrones

| Patrón | Tipo | Dónde en el proyecto | Problema que resuelve |
|--------|------|----------------------|------------------------|
| **Repository** | Estructural | `domain/fruits/repositories/fruit.repository.port.ts` + `infrastructure/persistence/fruits/postgres-fruit.repository.ts` | Desacoplar dominio de persistencia |
| **Use Case** | Arquitectónico | `application/fruits/use-cases/create-fruit/create-fruit.use-case.ts` | Una acción de negocio = una clase |
| **Command** | Arquitectónico | `application/fruits/use-cases/create-fruit/create-fruit.command.ts` | Input tipado al use case, sin acoplar a HTTP |
| **DTO** | Estructural | `interfaces/http/fruits/dto/create-fruit.request.dto.ts` | Contrato HTTP separado del dominio |
| **Mapper / Adapter** | Estructural | `infrastructure/persistence/fruits/fruit.mapper.ts` | Traducir entre capas (domain ↔ ORM) |
| **Dependency Injection** | Creacional | NestJS `@Injectable()` + tokens en `app.module.ts` | Invertir dependencias (puerto → implementación) |
| **Factory** | Creacional | `domain/fruits/factories/fruit.factory.ts` (opcional) | Construir agregados con reglas de dominio |
| **Strategy** | Comportamiento | `application/fruits/strategies/fruit-search.strategy.ts` (fase 2) | Algoritmos de búsqueda intercambiables |
| **Specification** | Comportamiento | `domain/fruits/specifications/fruit-by-climate.spec.ts` (fase 2) | Filtros reutilizables de dominio |
| **Decorator** | Estructural | NestJS Guards, Interceptors, Pipes, Exception Filters | Cross-cutting (validation, logging, error mapping) |
| **Unit of Work** | Comportamental | Transacción en `PostgresFruitRepository.save()` | Consistencia en tablas puente N:M |

## Ejemplos concretos por patrón

### Repository

```typescript
// domain/fruits/repositories/fruit.repository.port.ts
export interface FruitRepositoryPort {
  save(fruit: Fruit, relations: FruitRelations): Promise<Fruit>;
  findById(id: string): Promise<Fruit | null>;
}

// infrastructure/persistence/fruits/postgres-fruit.repository.ts
@Injectable()
export class PostgresFruitRepository implements FruitRepositoryPort {
  async save(fruit: Fruit, relations: FruitRelations): Promise<Fruit> {
    // TypeORM transaction + bridge tables
  }
}
```

### Use Case + Command

```typescript
// application/fruits/use-cases/create-fruit/create-fruit.command.ts
export class CreateFruitCommand {
  constructor(
    readonly commonName: string,
    readonly scientificName: string,
    readonly familyId: string,
    // ...
  ) {}
}

// application/fruits/use-cases/create-fruit/create-fruit.use-case.ts
@Injectable()
export class CreateFruitUseCase {
  async execute(command: CreateFruitCommand): Promise<Fruit> {
    // orchestrate domain rules + repository
  }
}
```

### Mapper

```typescript
// infrastructure/persistence/fruits/fruit.mapper.ts
export class FruitMapper {
  static toDomain(orm: FruitOrmEntity): Fruit { /* ... */ }
  static toPersistence(domain: Fruit): FruitOrmEntity { /* ... */ }
}
```

### Dependency Injection (wiring)

```typescript
// interfaces/app.module.ts
providers: [
  CreateFruitUseCase,
  { provide: FRUIT_REPOSITORY, useClass: PostgresFruitRepository },
]
```

## Patrón vs anti-patrón

| ✅ Patrón correcto | ❌ Anti-patrón | Por qué |
|-------------------|---------------|---------|
| `FruitRepositoryPort` en domain + `PostgresFruitRepository` en infra | Active Record: entidad ORM con lógica de negocio | El dominio no debe conocer SQL ni TypeORM |
| `CreateFruitUseCase` (una clase, un `execute()`) | God Service de 500 líneas con CRUD + búsqueda + reportes | Una responsabilidad por clase |
| `CreateFruitRequestDto` en interfaces, `Fruit` en domain | Exponer `FruitOrmEntity` directamente en el response | Filtra detalles de persistencia al cliente |
| `NotFoundException` en controller | Lanzar excepción de dominio; `DomainExceptionFilter` en `interfaces/` |
| `CreateFruitCommand` como input del use case | Use case que recibe el DTO HTTP directamente | Desacopla application de interfaces |
| Transacción en repositorio para tablas puente | Inserts sueltos sin transacción | Inconsistencia si falla a mitad |
| Value Object `CommonName` con validación | `string` sin validar en la entidad | Reglas de dominio encapsuladas |

## Cuándo NO aplicar un patrón

| Patrón | No usar cuando… |
|--------|-----------------|
| Factory | La entidad se construye con un simple `new` y no hay reglas complejas |
| Strategy | Solo hay un algoritmo de búsqueda (YAGNI hasta fase 2) |
| Specification | Filtros simples que caben en el repositorio con un `where` |
| Unit of Work separado | NestJS + TypeORM `QueryRunner` en el repositorio es suficiente para MVP |

## Patrones practicados en el vertical slice MVP

En `CreateFruit` + `GetFruitById`:

1. **Repository** — puerto + implementación Postgres
2. **Use Case** — una clase por acción
3. **Command** — input tipado al use case
4. **DTO** — request/response separados del dominio
5. **Mapper** — domain ↔ ORM
6. **Dependency Injection** — wiring en `app.module.ts`
7. **Decorator** — `ValidationPipe` global + `DomainExceptionFilter`

## Referencias

- Capas: [`02-clean-architecture-layers.md`](./02-clean-architecture-layers.md)
- Secuencia CreateFruit: [`04-sequence-create-fruit.md`](./04-sequence-create-fruit.md)
- Guía vertical slice: [`../guides/01-vertical-slice-fruits.md`](../guides/01-vertical-slice-fruits.md)
- Excepciones de dominio: [`06-domain-exceptions.md`](./06-domain-exceptions.md)
