# Patrones de diseño

Matriz de patrones con ejemplos concretos del dominio `Fruit`, cuándo aplicarlos y anti-patrones a evitar.

## Matriz de patrones

| Patrón | Tipo | Dónde en el proyecto | Problema que resuelve |
|--------|------|----------------------|------------------------|
| **Repository** | Estructural | `domain/fruits/repositories/fruit.repository.port.ts` + `infrastructure/persistence/fruits/fruit.repository.ts` | Desacoplar dominio de persistencia |
| **Use Case** | Arquitectónico | `application/fruits/use-cases/create-fruit/create-fruit.use-case.ts` | Una acción de negocio = una clase |
| **Command** | Arquitectónico | `application/fruits/use-cases/create-fruit/create-fruit.command.ts` | Input tipado al use case, sin acoplar a HTTP |
| **DTO** | Estructural | `interfaces/http/fruits/dto/create-fruit.request.dto.ts` | Contrato HTTP separado del dominio |
| **Mapper / Adapter** | Estructural | `infrastructure/persistence/fruits/fruit.mapper.ts` | Traducir entre capas (domain ↔ ORM) |
| **Read Model** | Arquitectónico | `domain/fruits/read-models/fruit-with-relations.read-model.ts` | Vista enriquecida para lecturas con joins |
| **Dependency Injection** | Creacional | NestJS `@Injectable()` + tokens en módulos HTTP | Invertir dependencias (puerto → implementación) |
| **Decorator** | Estructural | `ValidationPipe`, `DomainExceptionFilter` | Cross-cutting (validación, mapeo de errores) |
| **Unit of Work** | Comportamiento | Transacción en `FruitRepository.save()` / `update()` | Consistencia en tablas puente N:M |
| **Strategy** | Comportamiento | *(fase 2)* filtros avanzados en listados | Algoritmos intercambiables |
| **Specification** | Comportamiento | *(fase 2)* reglas de filtro reutilizables | Consultas de dominio composables |

## Ejemplos concretos

### Repository (puerto + implementación)

```typescript
// domain/fruits/repositories/fruit.repository.port.ts
export interface FruitRepositoryPort {
    save(fruit: Fruit, relations: FruitRelations): Promise<Fruit>;
    findByIdWithRelations(id: number): Promise<FruitWithRelations | null>;
    softDelete(id: number): Promise<void>;
}

// infrastructure/persistence/fruits/fruit.repository.ts
@Injectable()
export class FruitRepository implements FruitRepositoryPort {
    async save(fruit: Fruit, relations: FruitRelations): Promise<Fruit> {
        // QueryRunner transaction + bridge tables
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
        readonly familyId: number,
        readonly typeFruitId: number,
        readonly climateIds: number[],
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

### DomainException + filter

```typescript
// domain/fruits/exceptions/fruit.exceptions.ts
export class FruitNotFoundException extends DomainException {
    readonly kind = DomainExceptionKind.NOT_FOUND;
}

// interfaces/http/shared/filters/domain-exception.filter.ts
@Catch(DomainException)
export class DomainExceptionFilter { /* maps kind → HTTP status */ }
```

## Patrón vs anti-patrón

| ✅ Patrón correcto | ❌ Anti-patrón | Por qué |
|-------------------|---------------|---------|
| `FruitRepositoryPort` en domain + `FruitRepository` en infra | Active Record con lógica en entidad ORM | El dominio no debe conocer SQL |
| `CreateFruitUseCase` (un `execute()`) | God Service con CRUD + búsqueda + reportes | Una responsabilidad por clase |
| `CreateFruitRequestDto` en interfaces, `Fruit` en domain | Exponer `FruitOrmEntity` en response | Oculta detalles de persistencia |
| Excepción de dominio en use case | `NotFoundException` en controller | Desacopla HTTP del negocio |
| `CreateFruitCommand` como input | Use case que recibe el DTO HTTP | Desacopla application de interfaces |
| Transacción en repositorio para N:M | Inserts sueltos sin transacción | Datos huérfanos si falla a mitad |

## Cuándo NO aplicar un patrón

| Patrón | No usar cuando… |
|--------|-----------------|
| Strategy | Solo hay un algoritmo de búsqueda (YAGNI hasta fase 2) |
| Specification | Filtros simples caben en el repositorio con un `where` |
| Factory | La entidad se construye con `new` y no hay reglas complejas |

## Patrones en el vertical slice MVP

En `CreateFruit` + `GetFruitById`:

1. **Repository** — puerto + `FruitRepository`
2. **Use Case** — una clase por acción
3. **Command** — input tipado
4. **DTO** — request/response HTTP separados
5. **Mapper** — domain ↔ ORM
6. **Read Model** — `FruitWithRelations` para GET con joins
7. **Dependency Injection** — tokens en `FruitsModule`
8. **Decorator** — `ValidationPipe` + `DomainExceptionFilter`

## Referencias

- Capas: [`02-clean-architecture-layers.md`](./02-clean-architecture-layers.md)
- Secuencia CreateFruit: [`04-sequence-create-fruit.md`](./04-sequence-create-fruit.md)
- Excepciones: [`06-domain-exceptions.md`](./06-domain-exceptions.md)
