# Patrones creacionales — Inyección de dependencias

## ¿Qué es?

**Inyección de dependencias (DI)** es entregar las dependencias de una clase desde afuera en lugar de crearlas dentro.

## Analogía cotidiana

Un chef no construye su propio horno en la cocina — la cocina (NestJS) le provee el horno (repository) que necesita.

## ¿Por qué importa?

Permite cambiar la implementación (mock en tests, PostgreSQL en prod) sin tocar el use case.

## Ejemplo mínimo

```typescript
// domain/fruits/repositories/fruit.repository.token.ts
export const FRUIT_REPOSITORY = Symbol('FRUIT_REPOSITORY');

// infrastructure — wiring en fruits.module.ts
{
    provide: FRUIT_REPOSITORY,
    useClass: FruitRepository,  // implementación concreta
}

// application — use case recibe el puerto
constructor(
    @Inject(FRUIT_REPOSITORY)
    private readonly fruitRepository: FruitRepositoryPort,
) {}
```

## Errores comunes

1. **Instanciar `new FruitRepository()` en el use case** — rompe DI y tests.
2. **Olvidar registrar el provider** en el módulo NestJS.
3. **No exportar el token** cuando otro módulo lo necesita (ver fix de `FAMILY_REPOSITORY`).

## Siguiente paso

- [04-Patrones-Estructurales](Study-04-Patrones-Estructurales)
