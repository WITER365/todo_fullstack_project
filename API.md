# API - Todo List

Base: /api/todos

GET /api/todos
- Lista todas las tareas
- Respuesta 200: [ { id, title, description, completed, created_at } ]

POST /api/todos
- Crea una tarea
- Body JSON: { title: string, description?: string, completed?: boolean }
- 201: Objeto creado

PUT /api/todos/{id}
- Actualiza una tarea parcialmente
- Body JSON: { title?: string, description?: string, completed?: boolean }
- 200: Objeto actualizado
- 404: Tarea no encontrada

DELETE /api/todos/{id}
- Elimina tarea
- 204: Eliminado
