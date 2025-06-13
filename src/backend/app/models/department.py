from sqlmodel import Field, SQLModel
from .region import Region

class Department(SQLModel, table=True):
    department_id: int = Field(primary_key=True, autoincrement=True, nullable=False)
    name: str = Field(
        min_length=3,
        max_length=50,
        description="Nombre del departamento"
    )
    region_id: int = Field(
        gt=0,
        description="ID de la región del departamento",
        foreign_key="Region.region_id"
    )
    config = {
        "schema_extra": {
            "example": {
                "name": "Chocó",
                "region_id": 2
            }
        }
    }