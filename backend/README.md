# Backend - FastAPI Todo App

## Ejecutar en local (con XAMPP MySQL)
1. Crear la base de datos en MySQL (por ejemplo usando phpMyAdmin):
   - Nombre: todo_db
2. Copiar `.env.example` a `.env` y actualizar `DATABASE_URL` con tus credenciales.
3. Instalar dependencias:
   ```
   pip install -r requirements.txt
   ```
4. Ejecutar:
   ```
   uvicorn app.main:app --reload --port 8000
   ```
5. La API queda disponible en `http://127.0.0.1:8000/api/todos`
