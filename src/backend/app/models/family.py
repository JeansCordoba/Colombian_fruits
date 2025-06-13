from sqlmodel import Field, SQLModel
from .type_plant import TypePlant

class Family(SQLModel, table=True):
    family_id: int = Field(primary_key=True, autoincrement=True, nullable=False)
    name: str = Field(
        min_length=3,
        max_length=50,
        description="Nombre de la familia"
    )
    type_plant_id: int = Field(
        gt=0,
        description="ID del tipo de planta de la familia",
        foreign_key="TypePlant.type_plant_id"
    )
    description: str = Field(
        min_length=3,
        max_length=1000,
        description="Descripción de la familia"
    )
    config = {
        "schema_extra": {
            "example": {
                "name": "Solanaceae",
                "type_plant_id": 1,
                "description": "Información de la familia"
            }
        }
    }