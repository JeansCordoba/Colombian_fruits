# Testing

Estrategia de pruebas del proyecto.

## Tests unitarios

Ubicación: junto a cada use case (`*.use-case.spec.ts`).

```bash
pnpm test          # modo interactivo/watch
pnpm test:ci       # CI — sin coverage
```

Patrón: Arrange-Act-Assert con mocks de puertos (`FruitRepositoryPort`, etc.).

## Tests e2e

Ubicación: `test/e2e/`.

```bash
pnpm test:e2e
```

Requiere PostgreSQL corriendo y migraciones aplicadas. Los tests verifican:

- `GET /health` — ping a base de datos
- Envelope `{ success, data, statusCode }` en endpoints de catálogo

## CI

El workflow `.github/workflows/ci.yml` ejecuta typecheck, test:ci y build en cada push/PR.

## Cobertura mínima recomendada

- Al menos un test unitario por use case público
- Smoke e2e por módulo HTTP crítico (health + un catálogo)

## Siguiente paso

- [[Troubleshooting]]
- [[Study/05-Patrones-Comportamiento]]
