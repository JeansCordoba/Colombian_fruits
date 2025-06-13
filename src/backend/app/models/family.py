from sqlmodel import Field, SQLModel, Relationship
from .type_plant import TypePlant
from .fruit import Fruit

class Family(SQLModel, table=True):
    family_id: int = Field(primary_key=True, autoincrement=True, nullable=False)
    name: str = Field(
        min_length=3,
        max_length=50,
        description="Nombre de la familia",
        index=True
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
    
    # Relaciones
    type_plant: TypePlant = Relationship(back_populates="families")
    fruit: list["Fruit"] = Relationship(back_populates="family")
    
    config = {
        "schema_extra": {
            "example": {
                "name": "Solanaceae",
                "type_plant_id": 1,
                "description": "Información de la familia"
            }
        }
    }