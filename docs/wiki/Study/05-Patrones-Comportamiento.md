# Patrones de comportamiento — Use Case, Command, Validators

## ¿Qué es?

Patrones que describen **cómo fluye la lógica**: una acción = una clase (Use Case), input tipado (Command), validación especializada.

## Analogía cotidiana

Un formulario de solicitud (Command) llega al departamento correcto (Use Case), que verifica requisitos (Validator) antes de archivar (Repository).

## ¿Por qué importa?

Evita controllers gigantes y concentra reglas de negocio en clases testeables.

## Ejemplo mínimo

```typescript
// Command — input tipado, sin HTTP
export class CreateFruitCommand {
    constructor(
        readonly commonName: string,
        readonly familyId: number,
        // ...
    ) {}
}

// Use Case — orquesta
await this.fruitRelationsValidator.validate(relations);
return this.fruitRepository.save(fruit, relations);

// Validator — servicio de aplicación
// application/fruits/services/fruit-relations.validator.ts
async validate(relations: FruitRelations): Promise<void> {
    // verifica que climateIds, departmentIds, etc. existen
}
```

## Errores comunes

1. **Use case con más de una responsabilidad** — ej. create + send email en la misma clase.
2. **Command con lógica** — el command solo transporta datos.
3. **Validar FKs solo en la BD** — captura errores tarde; valida en application.

## Siguiente paso

- [06-Patrones-Arquitectonicos](06-Patrones-Arquitectonicos)
