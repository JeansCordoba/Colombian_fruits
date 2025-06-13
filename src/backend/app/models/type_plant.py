from sqlmodel import Field, SQLModel

class TypePlant(SQLModel, table=True):
    type_plant_id: int = Field(primary_key=True, autoincrement=True, nullable=False)
    name: str = Field(
        min_length=3,
        max_length=50,
        description="Nombre del tipo de planta"
    )
    config = {
        "schema_extra": {
            "example": {
                "name": "Árbol"
            }
        }
    }