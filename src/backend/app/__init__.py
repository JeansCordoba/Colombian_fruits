from fastapi import FastAPI

app = FastAPI(
    title="Colombian Fruits API",
    description="API para gestionar frutas colombianas",
    version="1.0.0"
)

# Importar y registrar las rutas
from app.routes import fruits

app.include_router(fruits.router, prefix="/api/v1", tags=["fruits"])
