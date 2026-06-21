# Estado de implementación

Seguimiento del código construido vs. la arquitectura documentada.

## Estructura de código

Raíz actual del backend:

```
src/
├── domain/
│   └── fruits/
│       ├── entities/
│       ├── repositories/
│       └── exceptions/
├── application/          ← pendiente
├── infrastructure/       ← pendiente
└── interfaces/           ← pendiente
```

> La documentación original mencionaba `src/nestjs-api/`. El código vive directamente en `src/` con capas layer-first.

---

## Completado — `domain/fruits/`

| Archivo | Estado | Alineación con docs |
|---------|--------|---------------------|
| `entities/fruit.entity.ts` | ✅ Implementado | ✅ Coincide con ERD y guía vertical slice |
| `repositories/fruit.repository.port.ts` | ✅ Implementado | ✅ Incluye `FruitRelations`, `save`, `findById`, `findByScientificName`, `findAll` |
| `repositories/fruit.repository.token.ts` | ✅ Implementado | ✅ Token `FRUIT_REPOSITORY` para DI |
| `exceptions/fruit.exceptions.ts` | ✅ Implementado | ✅ Agrupado por contexto (convención acordada) |

### Excepciones implementadas

- `FruitNotFoundException`
- `FruitScientificNameNotFoundException`
- `DuplicateFruitScientificNameException`
- `InvalidFruitDataException`

Ver detalle en [`../architecture/06-domain-exceptions.md`](../architecture/06-domain-exceptions.md).

---

## Pendiente — siguiente en el vertical slice

| Capa | Qué falta |
|------|-----------|
| `application/fruits/` | `CreateFruitUseCase`, `GetFruitByIdUseCase`, commands/queries |
| `infrastructure/persistence/fruits/` | ORM entity, mapper, `PostgresFruitRepository` |
| `interfaces/http/fruits/` | Controller, DTOs, `DomainExceptionFilter` |
| Bootstrap | NestJS `main.ts`, `app.module.ts`, Docker PostgreSQL |

---

## Orden recomendado (de adentro hacia afuera)

1. ✅ `domain/fruits/` — **hecho**
2. ⬜ `application/fruits/use-cases/get-fruit-by-id/` — más simple, empezar aquí
3. ⬜ `application/fruits/use-cases/create-fruit/`
4. ⬜ `infrastructure/persistence/fruits/`
5. ⬜ `interfaces/http/fruits/` + exception filter
6. ⬜ Wiring en `app.module.ts`

---

## Referencias

- Guía paso a paso: [`01-vertical-slice-fruits.md`](./01-vertical-slice-fruits.md)
- Excepciones: [`../architecture/06-domain-exceptions.md`](../architecture/06-domain-exceptions.md)
