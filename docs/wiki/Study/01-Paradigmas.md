# Paradigmas de programación

## ¿Qué es?

Un **paradigma** es la forma general de pensar y escribir código: orientado a objetos, funcional, declarativo, etc.

## Analogía cotidiana

Es como elegir entre escribir una receta paso a paso (imperativo) o decir "quiero un postre sin gluten" y dejar que el chef decida cómo (declarativo).

## ¿Por qué importa?

Mezclar paradigmas sin criterio hace el código difícil de leer. Este proyecto usa **TypeScript orientado a objetos** con estilo **declarativo** en capas superiores (controllers delegan, no calculan).

## Ejemplo mínimo

```typescript
// application/fruits/use-cases/create-fruit/create-fruit.use-case.ts
@Injectable()
export class CreateFruitUseCase {
    async execute(command: CreateFruitCommand): Promise<Fruit> {
        // async/await: esperamos la BD sin bloquear el hilo
        const family = await this.familyRepository.findById(command.familyId);
        if (!family) {
            throw new FamilyNotFoundException(command.familyId);
        }
        // ...
    }
}
```

- **OOP:** clase con métodos y dependencias inyectadas.
- **async/await:** operaciones I/O no bloqueantes.

## Errores comunes

1. **Poner lógica de negocio en el controller** — viola la separación de capas.
2. **Olvidar `await`** — devuelves una Promise sin resolver, el caller recibe datos incorrectos.
3. **Usar `any`** — pierdes el beneficio de TypeScript.

## Siguiente paso

- [02-Arquitectura-Software](02-Arquitectura-Software)
