# Estado de implementación

Seguimiento del código construido vs. la arquitectura documentada.

## Estructura de código

Raíz actual del backend:

```
src/
├── domain/               ✅ iniciado
├── application/          ✅ use cases fruits
├── infrastructure/       ← pendiente
└── interfaces/           ← pendiente

Raíz del proyecto (tooling):
├── package.json          ✅ scripts build / typecheck
├── tsconfig.json         ✅ TypeScript + decoradores NestJS
├── tsconfig.build.json   ✅ build a dist/
├── nest-cli.json         ✅ preparado para bootstrap NestJS
└── pnpm-lock.yaml
```

> El código vive en `src/` con capas layer-first (no `src/nestjs-api/`).

---

## Configuración de compilación

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias NestJS + scripts `pnpm run typecheck` / `pnpm run build` |
| `tsconfig.json` | TypeScript estricto, `experimentalDecorators`, `emitDecoratorMetadata`, `rootDir: src` |
| `tsconfig.build.json` | Compila a `dist/` (excluye tests) |
| `nest-cli.json` | Preparado para cuando exista `main.ts` y bootstrap NestJS |
| `.vscode/settings.json` | IDE reconoce decoradores y strict mode |

Comandos:

```bash
pnpm run typecheck   # valida tipos sin generar archivos
pnpm run build       # compila src/ → dist/
```

## Completado — `domain/fruits/` (+ families, type-fruits)

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

## Completado — `application/fruits/`

| Archivo | Estado |
|---------|--------|
| `use-cases/create-fruit/create-fruit.command.ts` | ✅ |
| `use-cases/create-fruit/create-fruit.use-case.ts` | ✅ |
| `use-cases/get-fruit-by-id/get-fruit-by-id.command.ts` | ✅ |
| `use-cases/get-fruit-by-id/get-fruit-by-id.use-case.ts` | ✅ |
| `use-cases/create-fruit/create-fruit.use-case.spec.ts` | ✅ |
| `use-cases/get-fruit-by-id/get-fruit-by-id.use-case.spec.ts` | ✅ |

---

## Pendiente — siguiente en el vertical slice

| Capa | Qué falta |
|------|-----------|
| `infrastructure/persistence/fruits/` | ORM entity, mapper, `PostgresFruitRepository` |
| `interfaces/http/fruits/` | Controller, DTOs, `DomainExceptionFilter` |
| Bootstrap | NestJS `main.ts`, `app.module.ts`, Docker PostgreSQL |

---

## Orden recomendado (de adentro hacia afuera)

1. ✅ `domain/fruits/` (+ families, type-fruits)
2. ✅ `application/fruits/` — CreateFruit + GetFruitById + tests
3. ✅ Config TypeScript (`tsconfig`, scripts `build` / `typecheck`)
4. ⬜ `infrastructure/persistence/fruits/`
5. ⬜ `interfaces/http/fruits/` + exception filter
6. ⬜ Bootstrap NestJS (`main.ts`, `app.module.ts`)

---

## Referencias

- Guía paso a paso: [`01-vertical-slice-fruits.md`](./01-vertical-slice-fruits.md)
- Excepciones: [`../architecture/06-domain-exceptions.md`](../architecture/06-domain-exceptions.md)
