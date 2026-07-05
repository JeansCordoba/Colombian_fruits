# Deploy: Neon (PostgreSQL) + Render (API)

Stack acordado en [ADR 002](../architecture/adr/002-postgresql-neon.md): **Neon** para la base de datos y **Render** para la API NestJS en Docker.

## Arquitectura

```
GitHub repo
    └── Render Web Service (Dockerfile)
            ├── run-migrations.js
            ├── main.js
            └── HTTPS → https://colombian-fruits-api.onrender.com
                    │
                    └── Neon PostgreSQL (SSL)
```

## 1. Crear base de datos en Neon

1. Entra en [neon.tech](https://neon.tech/) y crea un proyecto.
2. Nombre sugerido: `colombian-fruits`.
3. Región: elige una cercana a **Oregon (US West)** si usas el `render.yaml` por defecto.
4. En **Connection details**, copia los valores (modo *Direct connection* o *Pooled* — para TypeORM suele bastar *Direct* al inicio).

Anota:

| Variable Neon | Ejemplo |
|---------------|---------|
| Host | `ep-cool-name-123456.us-west-2.aws.neon.tech` |
| Database | `neondb` o el nombre que elijas |
| User | `neondb_owner` |
| Password | *(generado por Neon)* |

5. (Opcional) Ejecuta migraciones desde tu máquina antes del primer deploy:

```bash
# .env temporal apuntando a Neon
DATABASE_HOST=ep-xxx.neon.tech
DATABASE_PORT=5432
DATABASE_NAME=neondb
DATABASE_USER=neondb_owner
DATABASE_PASSWORD=***
DATABASE_SSL=true
DATABASE_SYNCHRONIZE=false

pnpm migration:run
```

## 2. Crear Web Service en Render

### Opción A — Blueprint (`render.yaml`)

1. Sube el repo a GitHub.
2. En [render.com](https://render.com/) → **New** → **Blueprint**.
3. Conecta el repositorio; Render detectará [`render.yaml`](../../render.yaml).
4. Completa las variables marcadas como secretas (`sync: false`).

### Opción B — Manual

1. **New** → **Web Service** → conecta el repo.
2. **Language:** Docker.
3. **Dockerfile path:** `./Dockerfile`.
4. **Health Check Path:** `/health`.
5. **Plan:** Free.

## 3. Variables de entorno en Render

| Variable | Valor en producción |
|----------|---------------------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_SYNCHRONIZE` | `false` |
| `DATABASE_SSL` | `true` *(requerido por Neon)* |
| `DATABASE_HOST` | Host de Neon (`ep-....neon.tech`) |
| `DATABASE_PORT` | `5432` |
| `DATABASE_NAME` | Nombre de la BD en Neon |
| `DATABASE_USER` | Usuario de Neon |
| `DATABASE_PASSWORD` | Contraseña de Neon |
| `CORS_ORIGIN` | URL de tu frontend (o `*` solo para pruebas) |

> **No** actives `DATABASE_SYNCHRONIZE` en Render. El contenedor ejecuta migraciones al arrancar (`run-migrations.js` → `main.js`).

## 4. Deploy

1. Render construye la imagen Docker y despliega.
2. Revisa **Logs** — deberías ver migraciones aplicadas y `Nest application successfully started`.
3. Prueba:

| URL | Qué verificar |
|-----|---------------|
| `https://<tu-app>.onrender.com/health` | `{ "status": "ok", ... }` |
| `https://<tu-app>.onrender.com/api/docs` | Swagger UI |
| `https://<tu-app>.onrender.com/api/v1/departments` | CRUD (POST con body `{ "name": "...", "code": "ANT" }`) |

## 5. Comportamiento del free tier

- La API **se duerme** tras ~15 min sin tráfico.
- El primer request tras dormir puede tardar **30–60 segundos** (cold start).
- Neon free también puede tener cold start en la BD; aceptable para portfolio/demo.

## 6. Actualizaciones

Cada push a la rama conectada (ej. `main`) dispara un redeploy automático si activas **Auto-Deploy** en Render.

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| Error SSL / connection | Falta `DATABASE_SSL=true` | Actívalo en Render |
| `relation "department" does not exist` | Migraciones no corrieron | Revisa logs de `run-migrations.js`; ejecuta `pnpm migration:run` contra Neon |
| Health check falla | App no arrancó | Revisa credenciales Neon y logs de Render |
| CORS bloqueado | `CORS_ORIGIN` incorrecto | Pon la URL exacta del frontend |

## Referencias

- [Render — Deploy Docker](https://render.com/docs/docker)
- [Neon — Connect](https://neon.tech/docs/connect/connect-from-any-app)
- [ADR 002 — PostgreSQL + Neon](../architecture/adr/002-postgresql-neon.md)
