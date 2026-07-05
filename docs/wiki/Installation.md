# Instalación

Guía para levantar el proyecto en desarrollo local.

## Requisitos

- Node.js 22+
- pnpm 11+
- Docker Desktop (PostgreSQL)

## Pasos

### 1. Clonar e instalar

```bash
git clone https://github.com/JeansCordoba/Colombian_fruits.git
cd Colombian_fruits
pnpm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Detalle: [[Environment-Variables]].

### 3. PostgreSQL

```bash
docker compose up -d postgres
docker compose ps   # esperar status healthy
```

### 4. Migraciones

```bash
pnpm migration:run
```

Crea todas las tablas. **No hay seed** — las tablas quedan vacías.

Orden sugerido para datos mínimos vía Swagger (`http://localhost:3000/api/docs`):

1. `POST /api/v1/type-plants`
2. `POST /api/v1/type-fruits`
3. `POST /api/v1/climates`
4. `POST /api/v1/departments` (`name` + `code`)
5. `POST /api/v1/natural-regions`
6. `POST /api/v1/harvest-seasons`
7. `POST /api/v1/families` (`typePlantId`)
8. `POST /api/v1/fruits`

### 5. Arrancar API

```bash
pnpm start:dev
```

Usa `ts-node` — **no** incluye hot reload automático.

### Stack completo con Docker

```bash
docker compose up --build
# o: pnpm docker:up:build
```

La API ejecuta migraciones al iniciar (`run-migrations.js` → `main.js`).

## Verificación

```bash
curl http://localhost:3000/health
```

Respuesta esperada: `{ "status": "ok", "database": "connected", "timestamp": "..." }`

## Siguiente paso

- [[Database-Migrations]]
- [[API-Overview]]
