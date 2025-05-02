ARG PYTHON_VERSION="3.12-slim"
ARG PORT=8000

# Usamos una imagen de Python como base para el backend
FROM python:${PYTHON_VERSION}

# Run in unbuffered mode
ENV PYTHONUNBUFFERED=1

# Establecemos el directorio de trabajo
WORKDIR /opt/backend
ENV PYTHONPATH="/opt/backend"

# Copiamos los archivos de requirements.txt e instalamos las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del backend
COPY . .
COPY .docker/backend/.env.docker .env

# Parte de backend: Exponemos el puerto 8000 para Uvicorn
EXPOSE ${PORT}

# Comando para iniciar el servidor de Uvicorn
CMD ["gunicorn", "-c", "gunicorn.conf.py", "--reload", "app.main:app"]
