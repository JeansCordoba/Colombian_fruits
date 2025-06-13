# Usamos una imagen base de Python 3.11
# slim es una versión más ligera que la estándar
FROM python:3.11-slim

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalamos las dependencias del sistema necesarias
# gcc: necesario para compilar algunas dependencias de Python
# postgresql-client: herramientas para interactuar con PostgreSQL
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiamos el archivo requirements.txt al contenedor
COPY requirements.txt .

# Instalamos las dependencias de Python
# --no-cache-dir: evita guardar los paquetes en caché para reducir el tamaño de la imagen
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código de la aplicación
COPY . .

# Exponemos el puerto 8000 que usará nuestra aplicación
EXPOSE 8000

# Comando que se ejecutará cuando el contenedor inicie
# uvicorn: servidor ASGI para FastAPI
# --host 0.0.0.0: permite conexiones desde fuera del contenedor
# --port 8000: puerto donde se ejecutará la aplicación
# --reload: recarga automáticamente cuando hay cambios en el código
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 