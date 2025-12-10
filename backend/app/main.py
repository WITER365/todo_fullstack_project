from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine, Base
from app.routers import todos

# Crear tablas al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo API - FastAPI",
    version="1.0.0",
    description="API para gestión de tareas"
)


origins = [
    "https://todo-fullstack-project-eight.vercel.app", 
    "http://localhost:3000",  
    "http://localhost:5173",  
    "https://todo-fullstack-project.vercel.app", 
    "*" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(todos.router, prefix="/api/todos", tags=["todos"])

@app.get("/")
def read_root():
    return {"message": "Todo API - Bienvenido"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api")
def api_info():
    return {
        "name": "Todo API",
        "version": "1.0.0",
        "endpoints": {
            "todos": "/api/todos",
            "health": "/health"
        }
    }