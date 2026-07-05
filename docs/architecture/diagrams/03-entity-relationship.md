# Diagrama — Modelo entidad-relación (ERD)

Relaciones principales del catálogo de frutas colombianas.

```mermaid
erDiagram
    type_plants ||--o{ families : "has"
    families ||--o{ fruits : "classifies"
    type_fruits ||--o{ fruits : "types"
    fruits ||--o{ fruit_climates : "grows in"
    climates ||--o{ fruit_climates : "supports"
    fruits ||--o{ fruit_departments : "found in"
    departments ||--o{ fruit_departments : "contains"
    fruits ||--o{ fruit_natural_regions : "in region"
    natural_regions ||--o{ fruit_natural_regions : "defines"
    fruits ||--o{ fruit_harvest_seasons : "harvested"
    harvest_seasons ||--o{ fruit_harvest_seasons : "window"

    type_plants {
        int id PK
        varchar name
        timestamp deleted_at
    }

    families {
        int id PK
        varchar name
        int type_plant_id FK
        timestamp deleted_at
    }

    type_fruits {
        int id PK
        varchar name
        timestamp deleted_at
    }

    fruits {
        int id PK
        varchar common_name
        varchar scientific_name UK
        text description
        int family_id FK
        int type_fruit_id FK
        timestamp deleted_at
    }

    climates {
        int id PK
        varchar name
        timestamp deleted_at
    }

    departments {
        int id PK
        varchar name
        varchar code
        timestamp deleted_at
    }

    natural_regions {
        int id PK
        varchar name
        timestamp deleted_at
    }

    harvest_seasons {
        int id PK
        int start_month
        int end_month
        timestamp deleted_at
    }
```

## Notas

- `TypePlant` se alcanza vía `Family`, no hay FK directa en `fruits`.
- Tablas puente N:M: `fruit_climates`, `fruit_departments`, `fruit_natural_regions`, `fruit_harvest_seasons`.
- Soft delete (`deleted_at`) en catálogos y agregados principales.

## Referencias

- [schema.dbml](../../database/schema.dbml)
- [Glosario botánico](../../database/glossary.md)
