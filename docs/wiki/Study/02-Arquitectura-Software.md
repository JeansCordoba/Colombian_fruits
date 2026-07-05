# Arquitectura de software

## ¿Qué es?

La **arquitectura** define cómo se organizan las partes de un sistema y qué puede depender de qué.

## Analogía cotidiana

Un edificio: la estructura (vigas) no depende de la pintura de las paredes, pero la pintura sí necesita paredes ya construidas.

## ¿Por qué importa?

Sin reglas de dependencia, el dominio acaba acoplado a PostgreSQL o HTTP, y cambiar la BD rompe la lógica de negocio.

## Ejemplo mínimo

```
interfaces → application → domain ← infrastructure
```

- `domain/fruits/repositories/fruit.repository.port.ts` — **interfaz** (puerto), sin TypeORM.
- `infrastructure/persistence/fruits/fruit.repository.ts` — **implementación** con TypeORM.

El use case solo conoce el puerto, no PostgreSQL.

## Errores comunes

1. **Importar TypeORM en `domain/`** — el dominio debe ser puro.
2. **Lógica de negocio en DTOs** — los DTOs solo validan formato HTTP.
3. **Saltarse la capa application** — controller llamando directo al repository.

## Siguiente paso

- [03-Patrones-Creacionales](Study-03-Patrones-Creacionales)
- Profundizar: [Clean Architecture layers](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/02-clean-architecture-layers.md)
