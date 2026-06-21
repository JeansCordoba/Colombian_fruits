# ADR 004 — Estructura layer-first con capa `interfaces/`

## Estado

Aceptado

## Contexto

Clean Architecture puede organizarse de dos formas en NestJS:

1. **Module-first:** cada bounded context es una carpeta raíz con subcarpetas `domain/`, `application/`, etc. dentro (`modules/fruits/domain/`).
2. **Layer-first:** las capas son carpetas raíz y cada bounded context es subcarpeta dentro (`domain/fruits/`, `application/fruits/`).

Además, la cuarta capa puede llamarse `presentation/` (convención NestJS/frontend) o `interfaces/` (convención Clean Architecture de Uncle Bob — Interface Adapters).

## Decisión

1. Adoptar estructura **layer-first** como organización principal del código.
2. Nombrar la cuarta capa **`interfaces/`** (no `presentation/`).

## Razones

### Layer-first

| Criterio | Layer-first | Module-first |
|----------|-------------|--------------|
| Visibilidad de capas CA | Inmediata — abres `domain/` y ves todo el dominio | Debes entrar a cada módulo |
| Objetivo de aprendizaje | La arquitectura **es** la estructura de carpetas | Requiere disciplina mental |
| Regla "domain no importa infra" | Reforzada físicamente | Fácil de violar entre módulos |
| Escalabilidad con muchos dominios | Carpetas horizontales crecen | Mejor aislamiento por feature |
| Navegar un flujo completo | Saltas entre 4 carpetas raíz | Todo en `modules/fruits/` |

Para un **caso de estudio de Clean Architecture**, layer-first es superior porque hace las capas imposibles de ignorar.

### `interfaces/` vs `presentation/`

| Criterio | `interfaces/` | `presentation/` |
|----------|---------------|-----------------|
| Fidelidad a Clean Architecture (Uncle Bob) | ✓ Interface Adapters | Parcial — implica solo UI |
| Extensibilidad (HTTP, CLI, events, GraphQL) | ✓ Subcarpeta `http/` | Confuso para no-HTTP |
| Convención NestJS | Menos común | Más común en tutoriales |

## Estructura acordada

```
src/
├── domain/           # Entidades, puertos, excepciones
│   ├── fruits/
│   ├── families/
│   └── shared/
├── application/      # Use cases, commands, queries
│   ├── fruits/
│   └── families/
├── infrastructure/   # TypeORM, repos, mappers, config
│   └── persistence/
└── interfaces/       # Controllers, DTOs, app.module.ts
    └── http/
```

## Consecuencias

### Positivas

- Imposible confundir en qué capa va una clase nueva.
- `domain/` es 100% puro — sin imports de NestJS ni TypeORM.
- Subcarpeta `interfaces/http/` deja espacio para futuros adaptadores.
- Documentación y código reflejan la misma estructura mental.

### Negativas

- Para seguir un flujo (ej. CreateFruit) hay que navegar 4 carpetas raíz.
- No es la convención más común en proyectos NestJS comerciales (module-first es más popular).
- La composición DI se centraliza en `interfaces/app.module.ts` (puede crecer; mitigable con feature modules de wiring).

## Alternativas descartadas

- **Module-first con capas internas:** válido para producción, pero diluye el aprendizaje de CA.
- **`presentation/` como nombre de capa:** válido en contexto NestJS puro, pero menos preciso para adaptadores no-HTTP.
- **Vertical slice puro (sin capas explícitas):** organiza por feature pero no enseña separación de capas.

## Referencias

- Capas: [`../02-clean-architecture-layers.md`](../02-clean-architecture-layers.md)
- Estructura detallada: [`../03-layer-first-structure.md`](../03-layer-first-structure.md)
