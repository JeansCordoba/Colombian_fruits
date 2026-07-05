# Diagram: Entity-Relationship (ERD)

**Type:** ER diagram  
**Tool:** Mermaid (`erDiagram`)  
**Purpose:** Database relationships for catalogs, families, fruits, and N:M bridge tables.

---

## Diagram

```mermaid
erDiagram
    type_plants ||--o{ families : has
    families ||--o{ fruits : classifies
    type_fruits ||--o{ fruits : types
    fruits ||--o{ fruit_climates : grows_in
    climates ||--o{ fruit_climates : supports
    fruits ||--o{ fruit_departments : found_in
    departments ||--o{ fruit_departments : contains
    fruits ||--o{ fruit_natural_regions : in_region
    natural_regions ||--o{ fruit_natural_regions : defines
    fruits ||--o{ fruit_harvest_seasons : harvested
    harvest_seasons ||--o{ fruit_harvest_seasons : window

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

---

## Notes

- `TypePlant` is reached through `Family`; fruits have no direct FK to `type_plants`.
- N:M bridge tables: `fruit_climates`, `fruit_departments`, `fruit_natural_regions`, `fruit_harvest_seasons`.
- Soft delete via `deleted_at` on catalogs and main aggregates.

## References

- [schema.dbml](../../database/schema.dbml)
- [Botanical glossary](../../database/glossary.md)
