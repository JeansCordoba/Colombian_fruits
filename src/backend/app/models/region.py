from sqlmodel import Field, SQLModel

class Region(SQLModel, table=True):
    region_id: int = Field(primary_key=True, autoincrement=True, nullable=False)
    name: str = Field(
        min_length=3,
        max_length=50,
        description="Nombre de la región"
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
    config = {
        "schema_extra": {
            "example": {
                "name": "Pacífico",
                "weather": "Templado",
                "altitude": 1000
            }
        }
    }