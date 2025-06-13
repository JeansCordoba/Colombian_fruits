from sqlmodel import Field, SQLModel
from .fruit import Fruit
from .region import Region

class FruitRegion(SQLModel, table=True):
    fruit_id: int = Field(
        gt=0,
        description="ID de la fruta",
        foreign_key="Fruit.fruit_id"
    )
    region_id: int = Field(
        gt=0,
        description="ID de la región",
        foreign_key="Region.region_id"
    )
    config = {
        "schema_extra": {
            "example": {
                "fruit_id": 1,
                "region_id": 1
            }
        }
    }