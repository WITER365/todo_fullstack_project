# Arquitectura - Todo List (C4 Nivel 1)

Usuario -> Frontend (Vercel) -> Backend (Render) -> Base de datos (Railway / MySQL local XAMPP)

Componentes:
- Frontend (Vite + React): Páginas: Todos. Servicios: api service que consume /api/todos.
- Backend (FastAPI): Routers: /api/todos (GET, POST, PUT, DELETE). Modelos: Todo (id, title, description, completed, created_at).
- Base de datos: MySQL (tabla todos)

Flujo crear tarea:
1. Usuario envía formulario en Frontend.
2. Frontend hace POST a Backend /api/todos.
3. Backend valida y persiste en MySQL.
4. Backend responde con la tarea creada.
5. Frontend actualiza la UI.

CI Pipeline:
- on: [push, pull_request]
- jobs:
  - build-frontend: instala dependencias de Node y ejecuta `npm run build`.
