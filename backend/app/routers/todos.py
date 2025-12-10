#todos.py
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoOut, TodoUpdate
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[TodoOut])
def list_todos(db: Session = Depends(get_db)):
    """Obtener todas las tareas"""
    try:
        todos = db.query(Todo).order_by(Todo.created_at.desc()).all()
        return todos
    except Exception as e:
        logger.error(f"Error al obtener tareas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/{todo_id}", response_model=TodoOut)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    """Obtener una tarea por ID"""
    try:
        todo = db.query(Todo).filter(Todo.id == todo_id).first()
        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tarea con ID {todo_id} no encontrada"
            )
        return todo
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener tarea {todo_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.post("/", response_model=TodoOut, status_code=status.HTTP_201_CREATED)
def create_todo(todo_data: TodoCreate, db: Session = Depends(get_db)):
    """Crear una nueva tarea"""
    try:
        # Validar que el título no esté vacío
        if not todo_data.title or not todo_data.title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El título es obligatorio"
            )
        
        # Crear nueva tarea
        todo = Todo(
            title=todo_data.title.strip(),
            description=todo_data.description,
            completed=todo_data.completed if todo_data.completed is not None else False
        )
        
        db.add(todo)
        db.commit()
        db.refresh(todo)
        
        logger.info(f"Tarea creada: {todo.id}")
        return todo
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error al crear tarea: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al crear la tarea"
        )

@router.put("/{todo_id}", response_model=TodoOut)
def update_todo(todo_id: int, todo_data: TodoUpdate, db: Session = Depends(get_db)):
    """Actualizar una tarea existente"""
    try:
        # Buscar tarea existente
        todo = db.query(Todo).filter(Todo.id == todo_id).first()
        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tarea con ID {todo_id} no encontrada"
            )
        
        # Actualizar campos si se proporcionan
        if todo_data.title is not None:
            if not todo_data.title.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El título no puede estar vacío"
                )
            todo.title = todo_data.title.strip()
        
        if todo_data.description is not None:
            todo.description = todo_data.description
        
        if todo_data.completed is not None:
            todo.completed = todo_data.completed
        
        db.commit()
        db.refresh(todo)
        
        logger.info(f"Tarea actualizada: {todo_id}")
        return todo
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error al actualizar tarea {todo_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al actualizar la tarea"
        )

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Eliminar una tarea"""
    try:
        # Buscar tarea existente
        todo = db.query(Todo).filter(Todo.id == todo_id).first()
        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tarea con ID {todo_id} no encontrada"
            )
        
        # Eliminar tarea
        db.delete(todo)
        db.commit()
        
        logger.info(f"Tarea eliminada: {todo_id}")
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error al eliminar tarea {todo_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al eliminar la tarea"
        )
# ================================
#   ENDPOINTS PARA COMPLETADAS
# ================================

@router.get("/completed", response_model=List[TodoOut])
def list_completed(db: Session = Depends(get_db)):
    """Obtener todas las tareas completadas"""
    try:
        completed = db.query(Todo).filter(Todo.completed == True).order_by(Todo.created_at.desc()).all()
        return completed
    except Exception as e:
        logger.error(f"Error al obtener tareas completadas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al obtener tareas completadas"
        )


@router.put("/{todo_id}/complete", response_model=TodoOut)
def mark_as_completed(todo_id: int, db: Session = Depends(get_db)):
    """Marcar una tarea como completada"""
    try:
        todo = db.query(Todo).filter(Todo.id == todo_id).first()

        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tarea con ID {todo_id} no encontrada"
            )

        todo.completed = True
        db.commit()
        db.refresh(todo)
        logger.info(f"Tarea marcada como completada: {todo_id}")

        return todo

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error al completar tarea {todo_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al marcar como completada"
        )


@router.put("/{todo_id}/uncomplete", response_model=TodoOut)
def mark_as_pending(todo_id: int, db: Session = Depends(get_db)):
    """Marcar una tarea como NO completada"""
    try:
        todo = db.query(Todo).filter(Todo.id == todo_id).first()

        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tarea con ID {todo_id} no encontrada"
            )

        todo.completed = False
        db.commit()
        db.refresh(todo)
        logger.info(f"Tarea marcada como pendiente: {todo_id}")

        return todo

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error al descompletar tarea {todo_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al marcar como pendiente"
        )


@router.put("/complete/all", response_model=List[TodoOut])
def mark_all_completed(db: Session = Depends(get_db)):
    """Marcar TODAS las tareas como completadas"""
    try:
        todos = db.query(Todo).all()

        for todo in todos:
            todo.completed = True

        db.commit()
        logger.info("Todas las tareas marcadas como completadas")

        return todos

    except Exception as e:
        db.rollback()
        logger.error(f"Error al marcar todas como completadas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al completar todas las tareas"
        )


@router.delete("/completed", status_code=status.HTTP_204_NO_CONTENT)
def delete_completed(db: Session = Depends(get_db)):
    """Eliminar todas las tareas completadas"""
    try:
        completed = db.query(Todo).filter(Todo.completed == True).all()

        for todo in completed:
            db.delete(todo)

        db.commit()
        logger.info("Todas las tareas completadas eliminadas")

    except Exception as e:
        db.rollback()
        logger.error(f"Error al eliminar tareas completadas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar tareas completadas"
        )
