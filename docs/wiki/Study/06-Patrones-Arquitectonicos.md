# Patrones arquitectónicos — Layer-first, soft delete, transacciones N:M

## ¿Qué es un patrón arquitectónico?

Decisiones de **alto nivel** sobre cómo estructurar el proyecto completo — no una clase suelta, sino convenciones que todo el equipo sigue.

## Analogía cotidiana

Un hospital organizado por plantas (UCI, urgencias, consulta) en lugar de por paciente (cada habitación con su quirófano). Layer-first organiza por **capa técnica**; module-first organizaría por **feature**.

## Layer-first en este repo

```
src/
├── domain/fruits/          ← entidad, puerto, excepciones
├── application/fruits/     ← use cases
├── infrastructure/persistence/fruits/  ← ORM, mapper, repository
└── interfaces/http/fruits/ ← controller, DTOs, module
```

Ventaja para juniors: al abrir `src/` ves inmediatamente la arquitectura.

## Soft delete

En lugar de `DELETE` físico, se marca `deleted_at`:

`src/infrastructure/persistence/fruits/fruit.orm-entity.ts`

```typescript
@DeleteDateColumn({ name: 'deleted_at', nullable: true })
deletedAt: Date | null;
```

El endpoint `DELETE /api/v1/fruits/:id` responde **204** sin body. Los listados filtran registros con `deleted_at IS NULL`.

## Transacciones N:M

Una fruta tiene relaciones con climates, departments, etc. Guardar todo debe ser **atómico**:

`src/infrastructure/persistence/fruits/fruit.repository.ts`

```typescript
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.startTransaction();
try {
    // INSERT fruits
    // INSERT fruit_climates, fruit_departments, ...
    await queryRunner.commitTransaction();
} catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
} finally {
    await queryRunner.release();
}
```

Si falla a mitad, no quedan filas huérfanas en tablas puente.

## DomainException — errores de negocio tipados

`src/domain/shared/exceptions/domain-exception.base.ts`

```typescript
export enum DomainExceptionKind {
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    INVALID_DATA = 'INVALID_DATA',
}
```

El filter HTTP mapea `kind` → status code (404, 409, 422). Ver [[Study/04-Patrones-Estructurales]] y [excepciones en el repo](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/06-domain-exceptions.md).

## Errores comunes

1. **Hard delete en producción** — pierdes historial y referencias.
2. **Inserts N:M sin transacción** — inconsistencia parcial.
3. **Mezclar layer-first con carpetas `modules/fruits/` completas** — confunde a quien lee el repo.

## Siguiente paso

- [[Study/07-NestJS-En-Este-Proyecto]]
- [ADR layer-first](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/adr/004-layer-first-structure.md)
