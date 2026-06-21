# ADR 002 — PostgreSQL con Neon

## Estado

Aceptado

## Contexto

El backend necesita una base de datos relacional para modelar entidades botánicas con relaciones N:M (frutas ↔ climas, departamentos, regiones, temporadas). Se requiere PostgreSQL local para desarrollo y un servicio gestionado para producción.

## Decisión

- **Desarrollo local:** PostgreSQL via **Docker Compose**.
- **Producción:** **Neon** (PostgreSQL serverless, tier gratuito permanente).

## Razones

| Criterio | PostgreSQL + Neon | Alternativa (SQLite) | Alternativa (MongoDB) |
|----------|-------------------|----------------------|----------------------|
| Relaciones N:M con FKs | ✓ Nativo | Limitado | Manual (embedding) |
| Migraciones TypeORM | ✓ | Parcial | No aplica |
| Tier gratuito permanente (Neon) | ✓ | N/A | Atlas free tier limitado |
| Compatibilidad local ↔ prod | ✓ Mismo motor | Diferencias de dialecto | Modelo diferente |
| Índices en `common_name`, `scientific_name` | ✓ | ✓ | ✓ |

## Consecuencias

### Positivas

- Mismo SQL en local y producción.
- Neon ofrece branching de BD (útil para previews).
- Docker Compose permite levantar PostgreSQL con un comando.
- TypeORM migrations funcionan igual en ambos entornos.

### Negativas

- Requiere Docker instalado para desarrollo local.
- Neon tiene cold starts en tier gratuito (aceptable para MVP).
- Variables de conexión distintas entre local y prod (`.env` vs secrets en Render).

## Configuración prevista

```env
# .env.example (local)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=colombian_fruits
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# Producción (Neon)
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/colombian_fruits?sslmode=require
```

## Alternativas descartadas

- **SQLite:** no soporta bien el flujo de producción con Neon; dialecto distinto.
- **MongoDB:** el modelo es relacional con FKs y tablas puente; forzar documentos sería un anti-patrón.
- **Supabase:** válido, pero Neon tiene tier gratuito más generoso para PostgreSQL puro sin extras de auth/storage.

## Referencias

- [Neon](https://neon.tech/)
- ERD: [`../../database/schema.dbml`](../../database/schema.dbml)
