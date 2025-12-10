FROM python:3.10-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements primero para aprovechar cache de Docker
COPY requirements.txt .

# Instalar dependencias
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copiar todo el proyecto
COPY . .

# Exponer el puerto (opcional, solo informativo)
EXPOSE 8000

# Usar el puerto que Railway asigna
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
