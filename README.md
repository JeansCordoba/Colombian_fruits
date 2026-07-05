# Colombian Fruits API

API REST para un catálogo de frutas nativas de Colombia. Proyecto de aprendizaje con **Clean Architecture** (estructura layer-first) y **NestJS**.

| Recurso | Enlace |
|---------|--------|
| Documentación técnica | [docs/README.md](./docs/README.md) |
| Wiki operativa | [docs/wiki/Home.md](./docs/wiki/Home.md) |
| Wiki de estudio (juniors) | [docs/wiki/Study/Home.md](./docs/wiki/Study/Home.md) |
| GitHub Wiki | https://github.com/JeansCordoba/Colombian_fruits/wiki |

## Tech stack

| Capa / herramienta | Tecnología |
|--------------------|------------|
| Runtime | Node.js 22 |
| Framework | NestJS 11 |
| Lenguaje | TypeScript 6 |
| ORM | TypeORM |
| Base de datos | PostgreSQL 16 |
| Validación | class-validator / class-transformer |
| Documentación API | Swagger (`/api/docs`) |
| Tests | Jest + Supertest |
| Contenedores | Docker Compose |
| CI/CD | GitHub Actions |

## Requisitos previos

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 11+
- [Docker](https://www.docker.com/) (PostgreSQL local y stack completo opcional)

## Instalación paso a paso

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/JeansCordoba/Colombian_fruits.git
cd Colombian_fruits
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Ajusta `.env` si tu PostgreSQL usa credenciales distintas. Para desarrollo local con la API en el host, deja `DATABASE_HOST=localhost`.

### 3. Levantar PostgreSQL

```bash
docker compose up -d postgres
```

Espera a que el contenedor esté healthy (`docker compose ps`).

### 4. Ejecutar migraciones

```bash
pnpm migration:run
```

Esto crea todas las tablas del esquema. **Las tablas quedan vacías** — no hay script de seed incluido. Pobla los catálogos (type-plants, climates, departments, etc.) vía API usando Swagger o Postman antes de crear frutas con relaciones N:M.

### 5. Arrancar la API

**Desarrollo (hot reload con ts-node):**

```bash
pnpm start:dev
```

**Stack completo con Docker (API + PostgreSQL):**

```bash
docker compose up --build
```

El contenedor de la API ejecuta migraciones automáticamente al arrancar (`run-migrations.js` → `main.js`).

La API queda en `http://localhost:3000` (o el `PORT` de `.env`).

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm start:dev` | API en desarrollo con `ts-node` |
| `pnpm start` | Ejecuta el build compilado |
| `pnpm start:prod` | Migraciones + API en producción |
| `pnpm build` | Compila TypeScript a `dist/` |
| `pnpm typecheck` | Verifica tipos sin emitir archivos |
| `pnpm test` | Tests unitarios |
| `pnpm test:ci` | Tests unitarios en CI |
| `pnpm test:e2e` | Tests end-to-end con Supertest |
| `pnpm migration:run` | Aplica migraciones pendientes |
| `pnpm migration:revert` | Revierte la última migración |
| `pnpm migration:show` | Muestra estado de migraciones |
| `pnpm docker:up` | Levanta PostgreSQL |
| `pnpm docker:up:build` | Levanta stack completo (build) |
| `pnpm docker:down` | Detiene contenedores |
| `pnpm docker:logs` | Logs de PostgreSQL |

## URLs de la API

| Recurso | URL |
|---------|-----|
| Base API | `http://localhost:3000/api/v1` |
| Swagger | `http://localhost:3000/api/docs` |
| Health check | `http://localhost:3000/health` |

Listado completo de endpoints: [docs/api/endpoints.md](./docs/api/endpoints.md)

## Contrato de respuestas HTTP

**Éxito (recurso único):**

```json
{
  "success": true,
  "data": { },
  "statusCode": 200
}
```

**Éxito (lista paginada):**

```json
{
  "success": true,
  "data": [],
  "meta": { "total": 0, "page": 1, "limit": 20, "totalPages": 0 },
  "statusCode": 200
}
```

**Error:**

```json
{
  "statusCode": 404,
  "message": "Resource not found.",
  "error": "Not Found"
}
```

`message` puede ser un `string` o un arreglo de strings (validación de DTOs). `GET /health` responde fuera del prefijo `api/v1` con `{ status, database, timestamp }`.

Las operaciones `DELETE` realizan **soft delete** (`deleted_at`).

## Estructura del proyecto

```
src/
├── domain/           # Entidades, puertos, excepciones de dominio
├── application/      # Casos de uso y lógica de aplicación
├── infrastructure/   # TypeORM, config, persistencia, migraciones
└── interfaces/       # Controllers HTTP, DTOs, filtros, módulos NestJS
```

Diagramas: [docs/architecture/diagrams/](./docs/architecture/diagrams/)

## Variables de entorno

Copia `.env.example` a `.env`. Las más relevantes:

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto HTTP (default `3000`) |
| `DATABASE_HOST` | Host PostgreSQL (`localhost` en dev, `postgres` en Docker) |
| `DATABASE_PORT` | Puerto PostgreSQL (default `5432`) |
| `DATABASE_NAME` | Nombre de la base de datos |
| `DATABASE_USER` / `DATABASE_PASSWORD` | Credenciales |
| `DATABASE_SYNCHRONIZE` | **Siempre `false`** — usar migraciones |
| `CORS_ORIGIN` | Origen del frontend (ej. `http://localhost:5173`) |

Detalle completo: [docs/wiki/Environment-Variables.md](./docs/wiki/Environment-Variables.md)

## CI/CD y estrategia de ramas

El workflow [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) ejecuta en push/PR a `main` y `develop`:

1. `pnpm typecheck`
2. `pnpm test:ci`
3. `pnpm build`
4. Verificación de imagen Docker

| Rama | Propósito |
|------|-----------|
| `main` | MVP estable, listo para consumo por frontend |
| `develop` | Integración de features futuras y despliegue |

Flujo: features en `develop` → PR → `main` cuando estén listas.

## Datos iniciales

No hay script de seed en este repositorio. Tras `pnpm migration:run`:

1. Crear catálogos base vía `POST /api/v1/type-plants`, `/climates`, `/departments`, etc.
2. Crear familias con `POST /api/v1/families`
3. Crear frutas con `POST /api/v1/fruits`

Un seed con datos reales de Colombia será implementado en una fase posterior en `develop`.

## Licencia

Proyecto privado — caso de estudio educativo.
