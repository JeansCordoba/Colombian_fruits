# Paradigmas de programación

## ¿Qué es un paradigma?

Un **paradigma** es la forma general de pensar y escribir código: orientado a objetos (OOP), funcional, declarativo, etc. No es “mejor” uno que otro — lo importante es ser **consistente** dentro de un proyecto.

## Analogía cotidiana

Es como elegir el estilo de una cocina: en un restaurante de menú fijo (OOP con clases bien definidas) cada plato tiene su receta y su responsable. En un food truck improvisado (código sin estructura) todo mezclado en un solo archivo, cualquier cambio rompe algo distinto.

## ¿Qué paradigmas usa este proyecto?

| Paradigma | Cómo se ve aquí |
|-----------|-----------------|
| **OOP** | Clases (`CreateFruitUseCase`, `FruitRepository`) con dependencias inyectadas |
| **Declarativo (en HTTP)** | El controller **delega**; no calcula reglas de negocio |
| **Async/await** | Toda I/O (PostgreSQL) es asíncrona |
| **Tipado estático** | TypeScript con tipos explícitos — evita `any` |

## Ejemplo real — use case con async/await

Archivo: `src/application/fruits/use-cases/create-fruit/create-fruit.use-case.ts`

```typescript
@Injectable()
export class CreateFruitUseCase {
    constructor(
        @Inject(FRUIT_REPOSITORY)
        private readonly fruitRepository: FruitRepositoryPort,
        @Inject(FAMILY_REPOSITORY)
        private readonly familyRepository: FamilyRepositoryPort,
        // ...
    ) {}

    async execute(command: CreateFruitCommand): Promise<Fruit> {
        const family = await this.familyRepository.findById(command.familyId);
        if (!family) {
            throw new FamilyNotFoundException(command.familyId);
        }
        // ... más validaciones y persistencia
        return this.fruitRepository.save(fruit, relations);
    }
}
```

Observa tres cosas:

1. **`@Injectable()`** — NestJS puede inyectar dependencias en el constructor.
2. **`await`** — esperamos la respuesta de PostgreSQL sin bloquear el hilo.
3. **`throw new FamilyNotFoundException(...)`** — error de negocio tipado, no un string suelto.

## Errores comunes de juniors

| Error | Por qué es malo | Qué hacer |
|-------|-----------------|-----------|
| Lógica de negocio en el controller | Mezcla HTTP con reglas del dominio | Mover a use case |
| Olvidar `await` | Recibes una `Promise`, no el dato | Siempre `await` en llamadas async |
| Usar `any` | Pierdes autocompletado y detección de bugs | Declara interfaces y tipos |
| `console.log` para “debuggear” producción | Ruido y sin trazabilidad | Tests unitarios + Swagger |

## Mini ejercicio

Abre `src/interfaces/http/fruits/fruits.controller.ts` y localiza el método `create`. ¿Cuántas líneas de **regla de negocio** ves? Deberían ser cero: solo mapeo DTO → Command → UseCase → Response.

## Siguiente paso

- [[Study/02-Arquitectura-Software]]
