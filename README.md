# 📝 Todo Fullstack Project

Una aplicación fullstack completa de gestión de tareas construida con **FastAPI** (backend) y **React + Vite** (frontend).

## 🎯 Características

- ✅ Crear, editar, eliminar y completar tareas
- ✅ Base de datos MySQL persistente
- ✅ API RESTful moderna con FastAPI
- ✅ Frontend responsivo con React
- ✅ CI/CD automático con GitHub Actions
- ✅ Deployado en Render (backend) y Vercel (frontend)

---

## 📋 Requisitos previos

Asegúrate de tener instalado:

- **Node.js** (v18+) - [Descargar](https://nodejs.org/)
- **Python** (v3.10+) - [Descargar](https://www.python.org/)
- **MySQL** (v8.0+) - [Descargar](https://www.mysql.com/)
- **Git** - [Descargar](https://git-scm.com/)

---

## 🚀 Instalación Local

### 1. Clonar el repositorio

\`\`\`bash
git clone https://github.com/tu-usuario/todo_fullstack_project.git
cd todo_fullstack_project
\`\`\`

### 2. Configurar Backend (FastAPI)

#### Instalar dependencias

\`\`\`bash
cd backend
python -m venv venv

# En Windows:
venv\\Scripts\\activate
# En Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
\`\`\`

#### Configurar base de datos

1. Crear base de datos MySQL:

\`\`\`sql
CREATE DATABASE todos_db;
CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'contraseña';
GRANT ALL PRIVILEGES ON todos_db.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

2. Crear archivo `.env`:

\`\`\`bash
# backend/.env
DATABASE_URL=mysql+pymysql://usuario:contraseña@localhost:3306/todos_db
PORT=8000
VITE_API_BASE=http://localhost:8000
\`\`\`

#### Ejecutar servidor

\`\`\`bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

✅ Backend disponible en: **http://localhost:8000**

API Docs (Swagger): **http://localhost:8000/docs**

---

### 3. Configurar Frontend (React + Vite)

#### Instalar dependencias

\`\`\`bash
cd frontend
npm install
\`\`\`

#### Crear archivo `.env`

\`\`\`bash
# frontend/.env
VITE_API_BASE=http://localhost:8000
\`\`\`

#### Ejecutar servidor de desarrollo

\`\`\`bash
npm run dev
\`\`\`

✅ Frontend disponible en: **http://localhost:5173**

---

## 📁 Estructura del Proyecto

\`\`\`
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
│   └── Dockerfile              # Para Docker
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx            # Entry point React
│   │   ├── App.jsx             # Componente principal
│   │   ├── pages/
│   │   │   └── Todos.jsx       # Página de tareas
│   │   ├── components/
│   │   │   └── TodoItem.jsx    # Componente tarea
│   │   └── services/
│   │       └── api.js          # Cliente HTTP
│   ├── package.json            # Dependencias Node
│   ├── .env                    # Variables de entorno
│   ├── vite.config.js          # Config Vite
│   └── index.html              # HTML base
│
├── .github/workflows/
│   └── ci.yml                  # GitHub Actions CI/CD
└── README.md                   # Este archivo
\`\`\`

---

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/todos` | Obtener todas las tareas |
| GET | `/api/todos/completed` | Obtener tareas completadas |
| POST | `/api/todos` | Crear nueva tarea |
| PUT | `/api/todos/{id}` | Actualizar tarea |
| DELETE | `/api/todos/{id}` | Eliminar tarea |
| PATCH | `/api/todos/{id}/toggle` | Marcar como completada |

### Ejemplo de uso

\`\`\`bash
# Obtener todas las tareas
curl http://localhost:8000/api/todos

# Crear tarea
curl -X POST http://localhost:8000/api/todos \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Comprar leche","description":"Ir al supermercado"}'

# Actualizar tarea
curl -X PUT http://localhost:8000/api/todos/1 \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Comprar pan","completed":true}'

# Eliminar tarea
curl -X DELETE http://localhost:8000/api/todos/1
\`\`\`

---

## 🧪 Testing

### Tests Backend

\`\`\`bash
cd backend
pip install pytest pytest-asyncio
pytest tests/ -v
\`\`\`

### Linting Backend

\`\`\`bash
cd backend
pip install flake8
flake8 app/
\`\`\`

---

## 🐳 Docker (Opcional)

### Build y ejecutar con Docker

\`\`\`bash
# Build imagen
docker build -t todo-backend ./backend

# Ejecutar contenedor
docker run -p 8000:8000 \\
  -e DATABASE_URL=mysql+pymysql://user:pass@host:3306/todos_db \\
  todo-backend
\`\`\`

---

## ☁️ Deployment

### 📤 Deploy Backend en Render

1. **Conectar repositorio**
   - Ve a [Render.com](https://render.com)
   - Crea nuevo "Web Service"
   - Conecta tu repositorio GitHub

2. **Configurar variables de entorno**
   - DATABASE_URL: `mysql+pymysql://user:pass@host:3306/todos_db`
   - PORT: `8000`

3. **Configurar Build**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### 📤 Deploy Frontend en Vercel

1. **Conectar repositorio**
   - Ve a [Vercel.com](https://vercel.com)
   - Importa tu proyecto desde GitHub

2. **Configurar variables de entorno**
   - VITE_API_BASE: `https://tu-backend.onrender.com`

3. **Deploy automático**
   - Vercel automáticamente despliega en cada push a `main`

---

## 🔄 CI/CD con GitHub Actions

El proyecto incluye un workflow automático que:

✅ Ejecuta tests en backend y frontend  
✅ Verifica la calidad del código (linting)  
✅ Compila el frontend  
✅ Despliega automáticamente a Render y Vercel  

### Configurar Secrets en GitHub

1. Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**
2. Agrega estos secrets:

| Secret | Valor |
|--------|-------|
| `RENDER_API_KEY` | Tu API Key de Render |
| `RENDER_SERVICE_ID` | ID del servicio en Render |
| `VERCEL_TOKEN` | Tu token de Vercel |
| `VERCEL_ORG_ID` | Tu ID de organización en Vercel |
| `VERCEL_PROJECT_ID` | ID de tu proyecto en Vercel |

### Obtener tus secrets

**Render:**
- Ve a tu cuenta Render → Account → API Keys

**Vercel:**
- Ve a tu cuenta Vercel → Settings → Tokens

---

## 🛠️ Variables de Entorno

### Backend (`.env`)

\`\`\`env
# Base de datos
DATABASE_URL=mysql+pymysql://usuario:contraseña@localhost:3306/todos_db

# Servidor
PORT=8000

# Frontend
VITE_API_BASE=http://localhost:8000
\`\`\`

### Frontend (`.env`)

\`\`\`env
# API
VITE_API_BASE=http://localhost:8000

# Para producción (Render):
VITE_API_BASE=https://tu-backend.onrender.com
\`\`\`

---

## 📝 Scripts disponibles

### Backend

\`\`\`bash
# Desarrollo
python -m uvicorn app.main:app --reload

# Testing
pytest tests/ -v

# Linting
flake8 app/
\`\`\`

### Frontend

\`\`\`bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build local
npm run preview
\`\`\`

---

## 🐛 Troubleshooting

### Error: "Connection refused" en backend

\`\`\`
❌ Problema: No puede conectarse a MySQL
✅ Solución:
  1. Verifica que MySQL esté ejecutándose
  2. Revisa las credenciales en DATABASE_URL
  3. Crea la base de datos: CREATE DATABASE todos_db;
\`\`\`

### Error: "CORS error" en frontend

\`\`\`
❌ Problema: Frontend no puede llamar al backend
✅ Solución:
  1. Verifica que el backend esté corriendo (http://localhost:8000)
  2. Revisa VITE_API_BASE en frontend/.env
  3. Asegúrate de que CORS esté habilitado en main.py
\`\`\`

### Error: "Module not found" en Node

\`\`\`bash
# Solución: Reinstalar dependencias
cd frontend
rm -rf node_modules package-lock.json
npm install
\`\`\`

---

## 📚 Documentación

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [MySQL Docs](https://dev.mysql.com/doc/)

---

## 👨‍💻 Autor

Anderson Martinez - [GitHub](https://github.com/tu-usuario)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Soporte

Si encuentras problemas o tienes preguntas:
- Abre un [Issue](https://github.com/tu-usuario/todo_fullstack_project/issues)
- Envía un email a tu-email@ejemplo.com

**¡Gracias por usar Todo Fullstack Project! 🎉**
Erick ladino 
Camilo leon
---

