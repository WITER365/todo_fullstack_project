import React, { useEffect, useState } from 'react'
import api from '../services/api'
import TodoItem from '../components/TodoItem'
import './Todos.css'

export default function TodosPage() {
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const loadTodos = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await api.list()
            setTodos(data)
        } catch (err) {
            setError('Error cargando tareas: ' + err.message)
            console.error('Load error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTodos()
    }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!title.trim()) {
            alert('El título es obligatorio')
            return
        }
        try {
            const newTodo = await api.create({
                title: title.trim(),
                description: description.trim() || undefined,
                completed: false
            })
            setTitle('')
            setDescription('')
            setTodos(prev => [newTodo, ...prev])
        } catch (err) {
            alert('Error creando tarea: ' + err.message)
            console.error('Create error:', err)
        }
    }

    const handleUpdate = async (id, payload) => {
        try {
            const updated = await api.update(id, payload)
            setTodos(prev => prev.map(t => t.id === id ? updated : t))
        } catch (err) {
            alert('Error actualizando tarea: ' + err.message)
            console.error('Update error:', err)
        }
    }

    const handleToggle = async (id, currentCompleted) => {
        try {
            const updated = await api.update(id, { completed: !currentCompleted })
            setTodos(prev => prev.map(t => t.id === id ? updated : t))
        } catch (err) {
            alert('Error cambiando estado: ' + err.message)
            console.error('Toggle error:', err)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta tarea?')) return
        try {
            await api.delete(id)
            setTodos(prev => prev.filter(t => t.id !== id))
        } catch (err) {
            alert('Error eliminando tarea: ' + err.message)
            console.error('Delete error:', err)
        }
    }

    const handleSave = async (id, title, description) => {
        if (!title.trim()) {
            alert('El título es obligatorio')
            return
        }
        try {
            await api.update(id, {
                title: title.trim(),
                description: description.trim() || undefined
            })
            // Recargar la lista para asegurar datos actualizados
            loadTodos()
        } catch (err) {
            alert('Error guardando cambios: ' + err.message)
            console.error('Save error:', err)
        }
    }

    // Separar tareas completadas y pendientes
    const pendingTodos = todos.filter(todo => !todo.completed)
    const completedTodos = todos.filter(todo => todo.completed)

    return (
        <div className="todos-container">
            <h1>📝 Todo List</h1>
            
            <form onSubmit={handleCreate} className="todo-form">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Título de la tarea *"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Descripción (opcional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="form-textarea"
                        rows="3"
                    />
                </div>
                <button type="submit" className="btn-create">
                    Agregar Tarea
                </button>
            </form>

            {loading && (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Cargando tareas...</p>
                </div>
            )}

            {error && (
                <div className="error-alert">
                    <p>{error}</p>
                    <button onClick={loadTodos} className="btn-retry">
                        Reintentar
                    </button>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="todos-section">
                        <h2>Pendientes ({pendingTodos.length})</h2>
                        {pendingTodos.length === 0 ? (
                            <p className="empty-message">No hay tareas pendientes</p>
                        ) : (
                            pendingTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={() => handleToggle(todo.id, todo.completed)}
                                    onDelete={() => handleDelete(todo.id)}
                                    onSave={(title, description) => handleSave(todo.id, title, description)}
                                />
                            ))
                        )}
                    </div>

                    <div className="todos-section">
                        <h2>Completadas ({completedTodos.length})</h2>
                        {completedTodos.length === 0 ? (
                            <p className="empty-message">No hay tareas completadas</p>
                        ) : (
                            completedTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={() => handleToggle(todo.id, todo.completed)}
                                    onDelete={() => handleDelete(todo.id)}
                                    onSave={(title, description) => handleSave(todo.id, title, description)}
                                />
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    )
}