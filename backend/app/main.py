#main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine, Base
from app.routers import todos

# Crear tablas al iniciar (solo para desarrollo)
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Todo API - FastAPI",
    version="1.0.0",
    description="API para gestión de tareas"
)

origins = [
    "https://todo-fullstack-project-eight.vercel.app"  # tu frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # aquí van los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router, prefix="/api/todos", tags=["todos"])

@app.get("/")
def read_root():
    return {"message": "Todo API - Bienvenido"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}