# Troubleshooting

Problemas comunes y soluciones.

## La API no conecta a PostgreSQL

**Síntoma:** `database: "disconnected"` en `/health` o error ECONNREFUSED.

**Solución:**

1. Verifica que PostgreSQL esté corriendo: `docker compose ps`
2. Revisa `DATABASE_HOST` — `localhost` en host, `postgres` en Docker
3. Confirma credenciales en `.env`

## Error de migraciones

**Síntoma:** `Migration failed` al arrancar.

**Solución:**

1. `pnpm migration:show` — revisa estado
2. Si el esquema está corrupto por `synchronize` previo:
   ```bash
   docker compose down -v
   docker compose up -d postgres
   pnpm migration:run
   ```

## NestJS DI error — FAMILY_REPOSITORY

**Síntoma:** `Nest can't resolve dependencies of CreateFruitUseCase`.

**Causa:** `FruitsModule` necesita `FAMILY_REPOSITORY` exportado por `FamiliesModule`.

**Solución:** Verifica que `FamiliesModule` tenga `exports: [FAMILY_REPOSITORY]`.

## CORS bloqueado desde frontend

**Síntoma:** Browser muestra error CORS en peticiones desde Vite.

**Solución:** Ajusta `CORS_ORIGIN` en `.env` al origen exacto del frontend (ej. `http://localhost:5173`).

## Tablas vacías después de migrar

**Comportamiento esperado.** No hay seed incluido. Pobla catálogos vía Swagger antes de crear frutas.

## Puerto 3000 ocupado

Cambia `PORT` en `.env` o detén el proceso que lo usa.

## Siguiente paso

- [Installation](Installation)
- [Database-Migrations](Database-Migrations)
