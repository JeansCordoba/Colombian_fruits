# ADR 001 — NestJS sobre FastAPI

## Estado

Aceptado

## Contexto

El proyecto original tenía un backend FastAPI en Python. Se decidió reescribir el backend como caso de estudio de Clean Architecture y patrones de diseño. Se evaluaron NestJS (TypeScript) y mantener FastAPI.

## Decisión

Adoptar **NestJS** como framework del nuevo backend en `src/nestjs-api/`.

## Razones

| Criterio | NestJS | FastAPI |
|----------|--------|---------|
| Inyección de dependencias nativa | ✓ Módulos, providers, tokens | Parcial (Depends) |
| Alineación con Clean Architecture | ✓ DI + decorators + módulos | Requiere más disciplina manual |
| TypeScript + tipado estricto | ✓ | Python typing (menos estricto en runtime) |
| Ecosistema para patrones (Guards, Pipes, Interceptors) | ✓ | Middleware manual |
| Objetivo de aprendizaje (patrones + CA) | ✓ Framework diseñado para ello | CRUD rápido, menos estructural |
| Consistencia con reglas del equipo | ✓ NestJS + TypeScript | Python |

## Consecuencias

### Positivas

- DI out-of-the-box facilita Repository pattern e inversión de dependencias.
- TypeScript fuerza contratos explícitos entre capas.
- Decorators de NestJS (`@Injectable`, `@Controller`) mapean bien a la capa `interfaces/`.
- Ecosistema maduro: TypeORM, Swagger, testing con Jest.

### Negativas

- Curva de aprendizaje inicial de NestJS si vienes de Python.
- Más boilerplate que FastAPI para un CRUD simple.
- El backend FastAPI legado queda obsoleto (archivar o eliminar cuando NestJS esté funcional).

## Alternativas descartadas

- **Mantener FastAPI:** más productivo para CRUD, pero menos alineado con el objetivo de estudiar Clean Architecture y patrones estructurales.
- **Express puro:** sin DI ni estructura; requeriría construir todo desde cero.

## Referencias

- [NestJS Documentation](https://docs.nestjs.com/)
- Plan del proyecto: [`../../README.md`](../../README.md)
