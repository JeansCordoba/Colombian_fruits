# Patrones de comportamiento — Use Case, Command, Validator

## ¿Qué son los patrones de comportamiento?

Describen **cómo fluye la lógica**: quién hace qué, en qué orden, y con qué datos de entrada.

## Analogía cotidiana

Un formulario (Command) llega al departamento correcto (Use Case). Un verificador (Validator) revisa que los anexos existan antes de archivar (Repository).

## Use Case — una acción, una clase

Convención del proyecto: **un use case = una clase = un método `execute()`**.

| Use case | Acción |
|----------|--------|
| `CreateFruitUseCase` | Crear fruta + relaciones N:M |
| `GetFruitByIdUseCase` | Leer fruta con relaciones |
| `ListFruitsUseCase` | Listado paginado + búsqueda |
| `UpdateFruitUseCase` | Actualizar y reemplazar N:M |
| `DeleteFruitUseCase` | Soft delete |

Archivo típico: `src/application/fruits/use-cases/create-fruit/create-fruit.use-case.ts`

## Command — input tipado (sin HTTP)

`src/application/fruits/use-cases/create-fruit/create-fruit.command.ts`

```typescript
export class CreateFruitCommand {
    constructor(
        readonly commonName: string,
        readonly scientificName: string,
        readonly description: string | null,
        readonly familyId: number,
        readonly typeFruitId: number,
        readonly climateIds: number[],
        readonly departmentIds: number[],
        readonly naturalRegionIds: number[],
        readonly harvestSeasonIds: number[],
    ) {}
}
```

El controller convierte `CreateFruitRequestDto` → `CreateFruitCommand`. Así el use case **no conoce** `@Body()` ni decoradores HTTP.

## Validator — reglas de aplicación reutilizables

`src/application/fruits/services/fruit-relations.validator.ts`

Verifica que cada ID en `climateIds`, `departmentIds`, etc. exista en su catálogo. Si no, lanza la excepción de dominio correspondiente (`ClimateNotFoundException`, etc.).

Esto es más claro que depender solo del error de FK de PostgreSQL.

## Flujo completo en el controller

`src/interfaces/http/fruits/fruits.controller.ts` (simplificado):

```typescript
@Post()
async create(@Body() dto: CreateFruitRequestDto): Promise<FruitResponseDto> {
    const command = new CreateFruitCommand(/* map from dto */);
    await this.createFruitUseCase.execute(command);
    const fruit = await this.getFruitByIdUseCase.execute(new GetFruitByIdCommand(savedId));
    return buildApiSuccessResponse(this.toResponseDto(fruit), HttpStatus.CREATED);
}
```

Post-create se hace **re-fetch** con `GetFruitByIdUseCase` para devolver relaciones anidadas completas.

## Errores comunes

| Error | Consecuencia |
|-------|--------------|
| Use case con create + list + delete | Clase gigante, difícil de testear |
| Command con métodos de negocio | Mezcla transporte con lógica |
| Validar FKs solo en BD | Error 500 o mensaje críptico en vez de 404 claro |

## Siguiente paso

- [[Study/06-Patrones-Arquitectonicos]]
- [Secuencia CreateFruit](https://github.com/JeansCordoba/Colombian_fruits/blob/main/docs/architecture/04-sequence-create-fruit.md)
