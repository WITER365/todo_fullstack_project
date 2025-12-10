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
    const [showCompleted, setShowCompleted] = useState(false) // Nuevo estado

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

    const loadCompleted = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await api.getCompleted()
            setTodos(data)
            setShowCompleted(true)
        } catch (err) {
            setError('Error cargando tareas completadas: ' + err.message)
            console.error('Load completed error:', err)
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
            if (showCompleted) {
                setShowCompleted(false) // Volver a mostrar todas
            }
        } catch (err) {
            alert('Error creando tarea: ' + err.message)
            console.error('Create error:', err)
        }
    }

    const handleUpdate = async (id, payload) => {
        try {
            const updated = await api.update(id, payload)
            setTodos(prev => prev.map(t => t.id === id ? updated : t))
            return updated
        } catch (err) {
            alert('Error actualizando tarea: ' + err.message)
            console.error('Update error:', err)
            throw err
        }
    }

    const handleToggle = async (id, currentCompleted) => {
        try {
            let updated
            if (currentCompleted) {
                updated = await api.uncomplete(id)
            } else {
                updated = await api.complete(id)
            }
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
            loadTodos() // Recargar para mantener consistencia
        } catch (err) {
            alert('Error guardando cambios: ' + err.message)
            console.error('Save error:', err)
        }
    }

    // Funciones para manejar tareas completadas
    const handleMarkAllCompleted = async () => {
        if (!confirm('¿Marcar todas las tareas como completadas?')) return
        try {
            const updatedTodos = await api.completeAll()
            setTodos(updatedTodos)
            alert('Todas las tareas marcadas como completadas')
        } catch (err) {
            alert('Error marcando todas como completadas: ' + err.message)
            console.error('Complete all error:', err)
        }
    }

    const handleDeleteAllCompleted = async () => {
        if (!confirm('¿Eliminar todas las tareas completadas?')) return
        try {
            await api.deleteCompleted()
            // Filtrar localmente las completadas
            setTodos(prev => prev.filter(todo => !todo.completed))
            alert('Todas las tareas completadas eliminadas')
        } catch (err) {
            alert('Error eliminando tareas completadas: ' + err.message)
            console.error('Delete completed error:', err)
        }
    }

    // Separar tareas por estado
    const pendingTodos = todos.filter(todo => !todo.completed)
    const completedTodos = todos.filter(todo => todo.completed)

    // Contadores
    const totalTodos = todos.length
    const pendingCount = pendingTodos.length
    const completedCount = completedTodos.length

    return (
        <div className="todos-container">
            <h1>📝 Todo List</h1>
            
            {/* Estadísticas */}
            <div className="stats">
                <div className="stat">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">{totalTodos}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Pendientes:</span>
                    <span className="stat-value pending">{pendingCount}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Completadas:</span>
                    <span className="stat-value completed">{completedCount}</span>
                </div>
            </div>
            
            {/* Formulario para crear tareas */}
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

            {/* Controles de acciones masivas */}
            <div className="bulk-actions">
                {completedCount > 0 && (
                    <button 
                        onClick={handleDeleteAllCompleted}
                        className="btn btn-bulk btn-delete-all"
                    >
                        🗑️ Eliminar Completadas ({completedCount})
                    </button>
                )}
                {pendingCount > 0 && (
                    <button 
                        onClick={handleMarkAllCompleted}
                        className="btn btn-bulk btn-complete-all"
                    >
                        ✅ Marcar Todas Completadas ({pendingCount})
                    </button>
                )}
                <div className="view-controls">
                    <button 
                        onClick={loadTodos}
                        className={`btn-view ${!showCompleted ? 'active' : ''}`}
                    >
                        Ver Todas ({totalTodos})
                    </button>
                    <button 
                        onClick={loadCompleted}
                        className={`btn-view ${showCompleted ? 'active' : ''}`}
                    >
                        Ver Completadas ({completedCount})
                    </button>
                </div>
            </div>

            {/* Estado de carga */}
            {loading && (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>{showCompleted ? 'Cargando tareas completadas...' : 'Cargando tareas...'}</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="error-alert">
                    <p>{error}</p>
                    <button onClick={showCompleted ? loadCompleted : loadTodos} className="btn-retry">
                        Reintentar
                    </button>
                </div>
            )}

            {/* Lista de tareas */}
            {!loading && !error && (
                <>
                    {!showCompleted ? (
                        // Vista normal: mostrar pendientes y completadas separadas
                        <>
                            <div className="todos-section">
                                <h2 className="section-header">
                                    <span>Pendientes</span>
                                    <span className="count-badge">{pendingCount}</span>
                                </h2>
                                {pendingTodos.length === 0 ? (
                                    <p className="empty-message">🎉 ¡No hay tareas pendientes!</p>
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

                            {completedTodos.length > 0 && (
                                <div className="todos-section">
                                    <h2 className="section-header">
                                        <span>Completadas</span>
                                        <span className="count-badge completed">{completedCount}</span>
                                    </h2>
                                    {completedTodos.map(todo => (
                                        <TodoItem
                                            key={todo.id}
                                            todo={todo}
                                            onToggle={() => handleToggle(todo.id, todo.completed)}
                                            onDelete={() => handleDelete(todo.id)}
                                            onSave={(title, description) => handleSave(todo.id, title, description)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        // Vista de solo completadas
                        <div className="todos-section">
                            <h2 className="section-header">
                                <span>Tareas Completadas</span>
                                <span className="count-badge completed">{completedCount}</span>
                            </h2>
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
                    )}
                </>
            )}
        </div>
    )
}