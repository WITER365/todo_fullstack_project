from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Obtener DATABASE_URL de variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")

# Para MySQL (XAMPP):
# DATABASE_URL = "mysql+mysqlconnector://root:@localhost:3306/todo_db"

engine = create_engine(
    DATABASE_URL,
    # Para MySQL, agregar pool_recycle=3600 si es necesario
    # connect_args={"check_same_thread": False}  # Solo para SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener sesión de BD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()