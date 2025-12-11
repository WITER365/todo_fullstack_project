# 📝 Todo Fullstack Project

Una aplicación fullstack completa de gestión de tareas construida con **FastAPI** (backend) y **React + Vite** (frontend).

## 🎯 Características

* ✅ Crear, editar, eliminar y completar tareas
* ✅ Base de datos MySQL persistente
* ✅ API RESTful moderna con FastAPI
* ✅ Frontend responsivo con React
* ✅ CI/CD automático con GitHub Actions
* ✅ Deployado en Render (backend) y Vercel (frontend)

---

## 📋 Requisitos previos

Asegúrate de tener instalado:

* **Node.js** (v18+) – *[https://nodejs.org/](https://nodejs.org/)*
* **Python** (v3.10+) – *[https://www.python.org/](https://www.python.org/)*
* **MySQL** (v8.0+) – *[https://www.mysql.com/](https://www.mysql.com/)*
* **Git** – *[https://git-scm.com/](https://git-scm.com/)*

---

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/todo_fullstack_project.git
cd todo_fullstack_project
```

---

## 2. Configurar Backend (FastAPI)

### Instalar dependencias

```bash
cd backend
python -m venv venv

# En Windows:
venv\Scripts\activate

# En Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

### Configurar base de datos

1. Crear base de datos MySQL:

```sql
CREATE DATABASE todos_db;
CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'contraseña';
GRANT ALL PRIVILEGES ON todos_db.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;
```

2. Crear archivo `.env`:

```env
# backend/.env
DATABASE_URL=mysql+pymysql://usuario:contraseña@localhost:3306/todos_db
PORT=8000
VITE_API_BASE=http://localhost:8000
```

### Ejecutar servidor

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✔ Backend disponible en: **[http://localhost:8000](http://localhost:8000)**
🔧 Swagger Docs: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 3. Configurar Frontend (React + Vite)

### Instalar dependencias

```bash
cd frontend
npm install
```

### Crear archivo `.env`

```env
# frontend/.env
VITE_API_BASE=http://localhost:8000
```

### Ejecutar servidor de desarrollo

```bash
npm run dev
```

✔ Frontend disponible en: **[http://localhost:5173](http://localhost:5173)**

---

## 📁 Estructura del Proyecto

```plaintext
todo_fullstack_project/
├── backend/
│   ├── app/
│   │   ├── main.py              # Punto de entrada FastAPI
│   │   ├── db/
│   │   │   └── session.py       # Configuración DB
│   │   ├── models/
│   │   │   └── todo.py          # Modelo SQLAlchemy
│   │   ├── routers/
│   │   │   └── todos.py         # Endpoints API
│   │   ├── schemas/
│   │   │   └── todo.py          # Validación Pydantic
│   │   └── tests/
│   │       └── test_main.py     # Tests unitarios
│   ├── requirements.txt         # Dependencias Python
│   ├── .env                     # Variables de entorno
│   └── Dockerfile               # Para Docker
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # Entry point React
│   │   ├── App.jsx              # Componente principal
│   │   ├── pages/
│   │   │   └── Todos.jsx        # Página de tareas
│   │   ├── components/
│   │   │   └── TodoItem.jsx     # Componente tarea
│   │   └── services/
│   │       └── api.js           # Cliente HTTP
│   ├── package.json             # Dependencias Node
│   ├── .env                     # Variables de entorno
│   ├── vite.config.js           # Configuración Vite
│   └── index.html               # HTML base
│
├── .github/workflows/
│   └── ci.yml                   # GitHub Actions CI/CD
│
└── README.md                    # Este archivo
```

---

## 🔌 API Endpoints

| Método | Endpoint                 | Descripción                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/api/todos`             | Obtener todas las tareas   |
| GET    | `/api/todos/completed`   | Obtener tareas completadas |
| POST   | `/api/todos`             | Crear nueva tarea          |
| PUT    | `/api/todos/{id}`        | Actualizar tarea           |
| DELETE | `/api/todos/{id}`        | Eliminar tarea             |
| PATCH  | `/api/todos/{id}/toggle` | Marcar como completada     |

### Ejemplos de uso

```bash
# Obtener todas las tareas
curl http://localhost:8000/api/todos

# Crear tarea
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar leche","description":"Ir al supermercado"}'

# Actualizar tarea
curl -X PUT http://localhost:8000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar pan","completed":true}'

# Eliminar tarea
curl -X DELETE http://localhost:8000/api/todos/1
```

---

## 🧪 Testing

### Tests Backend

```bash
cd backend
pip install pytest pytest-asyncio
pytest tests/ -v
```

### Linting Backend

```bash
cd backend
pip install flake8
flake8 app/
```

---

## 🐳 Docker (Opcional)

```bash
# Build imagen
docker build -t todo-backend ./backend

# Ejecutar contenedor
docker run -p 8000:8000 \
  -e DATABASE_URL=mysql+pymysql://user:pass@host:3306/todos_db \
  todo-backend
```

---

## ☁️ Deployment

### 🚀 Backend en Render

1. Conectar repositorio
2. Configurar variables de entorno:

   * `DATABASE_URL=mysql+pymysql://user:pass@host:3306/todos_db`
   * `PORT=8000`
3. Configurar Build

   * Build: `pip install -r requirements.txt`
   * Start: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### 🚀 Frontend en Vercel

1. Importar repo
2. Variables de entorno:

   * `VITE_API_BASE=https://tu-backend.onrender.com`
3. Deploy automático en cada push

---

## 🔄 CI/CD con GitHub Actions

Incluye:

* ✔ Tests backend y frontend
* ✔ Linting
* ✔ Compilación frontend
* ✔ Deploy a Render y Vercel

### Secrets requeridos

| Secret            | Valor                 |
| ----------------- | --------------------- |
| RENDER_API_KEY    | API Key de Render     |
| RENDER_SERVICE_ID | ID de servicio Render |
| VERCEL_TOKEN      | Token Vercel          |
| VERCEL_ORG_ID     | ID de organización    |
| VERCEL_PROJECT_ID | ID del proyecto       |

---

## 🛠️ Variables de Entorno

### Backend (`.env`)

```env
DATABASE_URL=mysql+pymysql://usuario:contraseña@localhost:3306/todos_db
PORT=8000
VITE_API_BASE=http://localhost:8000
```

### Frontend (`.env`)

```env
# Desarrollo
VITE_API_BASE=http://localhost:8000

# Producción
VITE_API_BASE=https://tu-backend.onrender.com
```

---

## 📝 Scripts disponibles

### Backend

```bash
# Desarrollo
python -m uvicorn app.main:app --reload

# Testing
pytest tests/ -v

# Linting
flake8 app/
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

## 🐛 Troubleshooting

### ❌ Connection refused en MySQL

✔ Verifica que MySQL esté corriendo
✔ Revisa `DATABASE_URL`
✔ Asegura que existe `todos_db`

---

### ❌ CORS error

✔ Backend disponible
✔ Revisar `VITE_API_BASE`
✔ CORS habilitado en `main.py`

---

### ❌ Module not found en Node

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentación

* FastAPI
* React
* Vite
* SQLAlchemy
* MySQL

---

## 👨‍💻 Autores

**Anderson Martinez**
**Erick Martinez**
**Camilo Leon**
---

## 📄 Licencia

MIT – ver archivo `LICENSE`.

---

## 🤝 Contribuir

1. Fork
2. Crear rama
3. Commit
4. Push
5. Pull Request

---

## 📞 Soporte

* Issues: [https://github.com/tu-usuario/todo_fullstack_project/issues](https://github.com/tu-usuario/todo_fullstack_project/issues)
* Email: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)

---

**¡Gracias por usar Todo Fullstack Project! 🎉**
Erick ladino 
Camilo leon
---

