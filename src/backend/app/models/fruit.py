from sqlmodel import Field, SQLModel, Relationship
from .family import Family
from .region import Region
from .fruit_region import FruitRegion

class Fruit(SQLModel, table=True):
    fruit_id: int = Field(primary_key=True, autoincrement=True, nullable=False)
    common_name: str = Field(
        min_length=3,
        max_length=50,
        description="Nombre común de la fruta",
        index=True
    )
    scientific_name: str = Field(
        min_length=3,
        max_length=50,
        description="Nombre científico de la fruta"
    )
    family_id: int = Field(
        gt=0,
        description="ID de la familia de la fruta",
        foreign_key="Family.family_id"
    )
    season: str = Field(
        min_length=3,
        max_length=50,
        description="Estación de la fruta"
    )
    description: str = Field(
        min_length=3,
        max_length=1000,
        description="Descripción de la fruta"
    )
    
    # Relaciones
    family: Family = Relationship(back_populates="fruits")
    regions: list["Region"] = Relationship(back_populates="fruits", link_model=FruitRegion)
    
    config = {
        "schema_extra": {
            "example": {
                "common_name": "Lulo",
                "scientific_name": "Solanum quitoense",
                "family_id": 1,
                "season": "Todo el año",
                "description": "Fruta ácida y refrescante típica de Colombia..."
            }
        }
    }