# Patrones arquitectónicos — Layer-first, soft delete, transacciones N:M

## ¿Qué es?

Decisiones de **alto nivel** sobre cómo estructurar el proyecto completo.

## Analogía cotidiana

Un hospital organizado por plantas (capas) en lugar de por pacientes (module-first): todos los laboratorios en un piso, todas las consultas en otro.

## ¿Por qué importa?

Layer-first hace visible la arquitectura en la estructura de carpetas. Soft delete preserva historial. Transacciones N:M garantizan consistencia.

## Ejemplo mínimo

```typescript
// Soft delete — ORM entity
@DeleteDateColumn({ name: 'deleted_at' })
deletedAt: Date | null;

// Transacción N:M — fruit.repository.ts
await queryRunner.startTransaction();
// INSERT fruit + bridge rows
await queryRunner.commitTransaction();

// Domain exception — mapeada a HTTP 404
throw new FamilyNotFoundException(familyId);
```

## Errores comunes

1. **Hard delete en producción** — pierdes trazabilidad; usa soft delete.
2. **Insertar puente N:M sin transacción** — datos huérfanos si falla a mitad.
3. **Module-first dentro de layer-first** — mezclar domain+infra en una carpeta `modules/fruits/`.

## Siguiente paso

- [07-NestJS-En-Este-Proyecto](07-NestJS-En-Este-Proyecto)
- [ADR layer-first](../../architecture/adr/004-layer-first-structure.md)
