import React, { useState } from 'react'
import './TodoItem.css'

export default function TodoItem({ todo, onToggle, onDelete, onSave }) {
    const [editing, setEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(todo.title)
    const [editDescription, setEditDescription] = useState(todo.description || '')

    const handleSave = () => {
        onSave(editTitle, editDescription)
        setEditing(false)
    }

    const handleCancel = () => {
        setEditTitle(todo.title)
        setEditDescription(todo.description || '')
        setEditing(false)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-header">
                <div className="todo-checkbox">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={onToggle}
                        className="checkbox"
                    />
                </div>
                
                <div className="todo-content">
                    {editing ? (
                        <>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="edit-input"
                                placeholder="Título"
                            />
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="edit-textarea"
                                placeholder="Descripción (opcional)"
                                rows="2"
                            />
                        </>
                    ) : (
                        <>
                            <h3 className="todo-title">{todo.title}</h3>
                            {todo.description && (
                                <p className="todo-description">{todo.description}</p>
                            )}
                        </>
                    )}
                    
                    <div className="todo-meta">
                        <span className="todo-date">
                            📅 {formatDate(todo.created_at)}
                        </span>
                        {todo.completed && (
                            <span className="todo-status">✅ Completada</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="todo-actions">
                {editing ? (
                    <>
                        <button 
                            onClick={handleSave}
                            className="btn btn-save"
                            disabled={!editTitle.trim()}
                        >
                            Guardar
                        </button>
                        <button 
                            onClick={handleCancel}
                            className="btn btn-cancel"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => setEditing(true)}
                            className="btn btn-edit"
                        >
                            ✏️ Editar
                        </button>
                        <button 
                            onClick={onDelete}
                            className="btn btn-delete"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}