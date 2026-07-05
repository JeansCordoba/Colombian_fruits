# Colombian Fruits API

REST API for a catalog of native Colombian fruits. Educational case study built with **Clean Architecture** (layer-first) and **NestJS**.

## Quick start

Prerequisites: Node.js 22+, pnpm 11+, Docker.

```bash
git clone https://github.com/JeansCordoba/Colombian_fruits.git
cd Colombian_fruits
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm migration:run
pnpm start:dev
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000/api/docs | Swagger UI |
| http://localhost:3000/api/v1 | REST API base path |
| http://localhost:3000/health | Health check (outside `api/v1`) |

Tables are created empty — there is **no seed script**. Populate master catalogs via Swagger before creating fruits with N:M relations.

Full installation and troubleshooting: [Wiki — Installation](https://github.com/JeansCordoba/Colombian_fruits/wiki/Installation).

## Production deploy (Neon + Render)

Free tier: **Neon** (PostgreSQL) + **Render** (Docker Web Service).

Step-by-step guide: [docs/guides/03-deploy-render-neon.md](./docs/guides/03-deploy-render-neon.md)

Quick checklist:

1. Create Neon project → copy `DATABASE_*` credentials.
2. Render → **New Blueprint** (or Web Service Docker) from this repo.
3. Set secrets in Render: `DATABASE_HOST`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `CORS_ORIGIN`.
4. Deploy → verify `https://<app>.onrender.com/health` and `/api/docs`.

## Documentation

| Audience | Where to go |
|----------|-------------|
| Technical reference (architecture, API, ADRs) | [docs/README.md](./docs/README.md) |
| Operations (env vars, migrations, CI, testing) | [GitHub Wiki](https://github.com/JeansCordoba/Colombian_fruits/wiki) |
| Learning path for juniors (Spanish) | [Wiki — Study](https://github.com/JeansCordoba/Colombian_fruits/wiki/Study-Home) |

## Tech stack

Node.js 22 · NestJS 11 · TypeScript · TypeORM · PostgreSQL 16 · Jest · Docker Compose · GitHub Actions

## Common scripts

| Script | Description |
|--------|-------------|
| `pnpm start:dev` | Dev server with `ts-node` (no file watch) |
| `pnpm start:prod` | Run migrations + production server |
| `pnpm typecheck` | TypeScript check |
| `pnpm test:ci` | Unit tests (CI mode) |
| `pnpm test:e2e` | HTTP smoke tests |
| `pnpm migration:run` | Apply pending migrations |
| `pnpm docker:up:build` | Full stack (API + PostgreSQL) |

Complete script list and environment variables: [docs/README.md](./docs/README.md).

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable MVP |
| `develop` | Future features (seed, deployment) |

## License

Private educational project.
