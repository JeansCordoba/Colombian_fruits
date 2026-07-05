# Variables de entorno

Copia `.env.example` a `.env` y ajusta según tu entorno.

## Aplicación

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto HTTP de la API |
| `NODE_ENV` | `development` | Entorno (`development`, `production`, `test`) |
| `CORS_ORIGIN` | `http://localhost:5173` | Origen permitido para CORS (frontend Vite) |

## PostgreSQL

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DATABASE_HOST` | `localhost` | Host BD. Usar `postgres` dentro de Docker Compose |
| `DATABASE_PORT` | `5432` | Puerto PostgreSQL |
| `DATABASE_NAME` | `colombian_fruits` | Nombre de la base de datos |
| `DATABASE_USER` | `postgres` | Usuario |
| `DATABASE_PASSWORD` | `postgres` | Contraseña |

## TypeORM

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DATABASE_SYNCHRONIZE` | `false` | **Siempre `false`**. Usar `pnpm migration:run` |

> **Importante:** No activar `synchronize` en producción ni después de usar migraciones. Puede desincronizar el esquema.

## Docker Compose

El servicio `api` sobrescribe:

- `DATABASE_HOST=postgres`
- `DATABASE_SYNCHRONIZE=false`
- `NODE_ENV=production`

## Siguiente paso

- [[Database-Migrations]]
