from sqlmodel import Field, SQLModel, Relationship
from .fruit import Fruit
from .fruit_region import FruitRegion
from .department import Department

class Region(SQLModel, table=True):
    region_id: int = Field(primary_key=True, autoincrement=True, nullable=False)
    name: str = Field(
        min_length=3,
        max_length=50,
        description="Nombre de la región",
        index=True
    )
    weather: str = Field(
        min_length=3,
        max_length=50,
        description="Clima de la región"
    )
    altitude: int = Field(
        gt=0,
        le=5000,
        description="Altura de la región en metros"
    )
    
    # Relaciones
    fruits: list["Fruit"] = Relationship(back_populates="regions", link_model=FruitRegion)
    departments: list["Department"] = Relationship(back_populates="region")
    config = {
        "schema_extra": {
            "example": {
                "name": "Pacífico",
                "weather": "Templado",
                "altitude": 1000
            }
        }
    }