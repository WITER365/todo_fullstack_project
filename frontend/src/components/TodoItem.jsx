import React, { useState } from 'react'
import './TodoItem.css'

export default function TodoItem({ todo, onToggle, onDelete, onSave }) {
    const [editing, setEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(todo.title)
    const [editDescription, setEditDescription] = useState(todo.description || '')

    const handleSave = async () => {
        if (!editTitle.trim()) {
            alert('El título es obligatorio')
            return
        }

        try {
            await onSave(editTitle.trim(), editDescription.trim() || null)
            setEditing(false)
        } catch (error) {
            // Error manejado en la función padre
        }
    }

    const handleCancel = () => {
        setEditTitle(todo.title)
        setEditDescription(todo.description || '')
        setEditing(false)
    }

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch (error) {
            return 'Fecha no disponible'
        }
    }

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
                {/* Checkbox para marcar estado */}
                <div className="todo-checkbox">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={onToggle}
                        className="checkbox"
                        id={`todo-checkbox-${todo.id}`}
                        title={todo.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                    />
                    <label htmlFor={`todo-checkbox-${todo.id}`} className="checkbox-label"></label>
                </div>

                {/* Contenido de la tarea */}
                <div className="todo-details">
                    {editing ? (
                        <div className="edit-form">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="edit-input"
                                placeholder="Título *"
                                autoFocus
                            />
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="edit-textarea"
                                placeholder="Descripción (opcional)"
                                rows="2"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="todo-header">
                                <h3 className="todo-title">{todo.title}</h3>
                                {todo.completed && (
                                    <span className="status-badge completed">✅ Completada</span>
                                )}
                            </div>
                            {todo.description && (
                                <p className="todo-description">{todo.description}</p>
                            )}
                            <div className="todo-footer">
                                <span className="todo-date">
                                    📅 Creada: {formatDate(todo.created_at)}
                                </span>
                                <span className="todo-id">ID: #{todo.id}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Acciones */}
            <div className="todo-actions">
                {editing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="btn btn-save"
                            disabled={!editTitle.trim()}
                            title="Guardar cambios"
                        >
                            💾 Guardar
                        </button>
                        <button
                            onClick={handleCancel}
                            className="btn btn-cancel"
                            title="Cancelar edición"
                        >
                            ❌ Cancelar
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setEditing(true)}
                            className="btn btn-edit"
                            title="Editar tarea"
                        >
                            ✏️ Editar
                        </button>
                        <button
                            onClick={onToggle}
                            className="btn btn-toggle"
                            title={todo.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                        >
                            {todo.completed ? '↩️ Pendiente' : '✅ Completar'}
                        </button>
                        <button
                            onClick={onDelete}
                            className="btn btn-delete"
                            title="Eliminar tarea"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}