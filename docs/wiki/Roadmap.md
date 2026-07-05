# Roadmap

Trabajo futuro en la rama `develop`. **Fuera de alcance del MVP en `main`.**

## Completado (MVP en `main`)

- [x] CRUD catálogos (6 recursos) + families + fruits
- [x] Relaciones N:M en fruits
- [x] Migraciones TypeORM (`DATABASE_SYNCHRONIZE=false`)
- [x] Health check + Swagger + CORS
- [x] Tests unitarios + e2e
- [x] Documentación, diagramas, wiki, sección Study

## Pendiente — `develop`

| Tema | Herramienta | Acciones |
|------|-------------|----------|
| **Despliegue BD prod** | Neon (PostgreSQL serverless) | Crear proyecto, `DATABASE_URL`, ejecutar migraciones |
| **Hosting API** | Por definir (Render, Railway, Fly.io) | Dockerfile ya existe; conectar env vars |
| **CI/CD deploy** | `.github/workflows/cd.yml` | Extender cuando exista target |
| **Seed de datos** | Script propio del usuario | Recolectar datos colombianos e implementar |
| **Filtros avanzados** | Query params en fruits | `?climate=`, `?department=` |

## Seed de datos

No incluido en el MVP. Tras migrar, poblar vía API. El usuario implementará un script de seed cuando tenga los datos reales recolectados.

## Despliegue

Ver [ADR 002](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/adr/002-postgresql-neon.md). Será el primer trabajo significativo en `develop` después del release de `main`.
