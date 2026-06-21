# Glosario del dominio botánico

Términos usados en el modelo de datos y la documentación de arquitectura.

## Entidades principales

| Término | Definición | Ejemplo |
|---------|------------|---------|
| **Fruit** | Fruta nativa o cultivada en Colombia. Agregado central del sistema. | Granadilla, lulo, guanábana |
| **Family** | Familia botánica según clasificación taxonómica. **FK a `TypePlant`.** | Passifloraceae, Annonaceae |
| **TypePlant** | Tipo de planta según su hábito de crecimiento. Relacionado con `Family`, no directamente con `Fruit`. | Árbol, arbusto, enredadera |
| **TypeFruit** | Clasificación morfológica del fruto. | Baya, drupa, agregado |
| **Department** | Departamento colombiano (división administrativa). | Valle del Cauca, Antioquia |
| **NaturalRegion** | Región natural de Colombia. | Andina, Amazónica, Caribe |
| **Climate** | Zona climática donde crece la fruta. | Tropical húmedo, templado de montaña |
| **HarvestSeason** | Ventana temporal de cosecha (`start_month` / `end_month`). Sin campo `name`. | startMonth: 1, endMonth: 3 |

## Tablas puente (N:M)

| Tabla | Relación | Significado |
|-------|----------|-------------|
| `fruit_climates` | Fruit ↔ Climate | Climas en los que se desarrolla la fruta |
| `fruit_departments` | Fruit ↔ Department | Departamentos donde se cultiva o encuentra |
| `fruit_natural_regions` | Fruit ↔ NaturalRegion | Regiones naturales de distribución |
| `fruit_harvest_seasons` | Fruit ↔ HarvestSeason | Temporadas de cosecha |

## Convenciones de nomenclatura

| Contexto | Convención | Ejemplo |
|----------|------------|---------|
| Base de datos | `snake_case`, plural | `common_name`, `harvest_seasons`, `type_plants` |
| IDs | `integer` auto-increment | `id: 1` |
| TypeScript (dominio) | `camelCase` | `commonName`, `harvestSeasons` |
| TypeScript (clases) | `PascalCase` | `Fruit`, `CreateFruitUseCase` |
| Archivos | `kebab-case` | `create-fruit.use-case.ts` |
| Puertos (interfaces) | sufijo `.port.ts` | `fruit.repository.port.ts` |
| Entidades ORM | sufijo `.orm-entity.ts` | `fruit.orm-entity.ts` |
| Excepciones dominio | `{context}.exceptions.ts` | `fruit.exceptions.ts` |

## Bounded contexts

| Context | Entidades | Rol |
|---------|-----------|-----|
| **Catalog** | Family, TypePlant, TypeFruit | Catálogos de referencia botánica |
| **Fruit** | Fruit + tablas puente | Agregado central y sus asociaciones |
| **Geo** | Department, NaturalRegion, Climate | Contexto geográfico y climático |
| **Season** | HarvestSeason | Temporadas de cosecha |
