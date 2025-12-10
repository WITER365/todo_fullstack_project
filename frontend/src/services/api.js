//api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

console.log('🔧 API_URL configurada como:', API_URL)

// Helper para construir URLs correctamente
function buildUrl(endpoint = '') {
    // Si la API_URL ya termina con /api/todos, no agregarlo de nuevo
    let baseUrl = API_URL
    
    // Remover slash final si existe
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1)
    }
    
    // Si la baseUrl ya incluye /api/todos, usar como está
    if (baseUrl.includes('/api/todos')) {
        // Si endpoint empieza con /, eliminarlo
        if (endpoint.startsWith('/')) {
            endpoint = endpoint.substring(1)
        }
        return `${baseUrl}${endpoint ? '/' + endpoint : ''}`
    }
    
    // Si no incluye /api/todos, agregarlo
    return `${baseUrl}/api/todos${endpoint}`
}

async function request(endpoint = '', options = {}) {
    const url = buildUrl(endpoint)
    
    console.log('🌐 Haciendo request a:', url, 'Options:', options.method || 'GET')
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    }
    
    // Agregar body si existe
    if (config.body && typeof config.body !== 'string') {
        config.body = JSON.stringify(config.body)
    }
    
    try {
        const response = await fetch(url, config)
        console.log('📡 Response status:', response.status, 'URL:', url)
        
        if (!response.ok) {
            let errorMessage = `Error ${response.status}`
            try {
                const errorData = await response.json()
                errorMessage = errorData.detail || errorData.message || errorMessage
            } catch {
                try {
                    const text = await response.text()
                    if (text) errorMessage = text
                } catch {
                    // Ignorar si no se puede leer
                }
            }
            throw new Error(errorMessage)
        }
        
        // Para DELETE (204 No Content)
        if (response.status === 204) {
            return null
        }
        
        return await response.json()
    } catch (error) {
        console.error('❌ Error en API:', error.message, 'URL:', url)
        throw error
    }
}

export default {
    // Obtener todas las tareas
    list: () => request(''),
    
    // Obtener tareas completadas
    getCompleted: () => request('/completed'),
    
    // Obtener una tarea por ID
    get: (id) => request(`/${id}`),
    
    // Crear nueva tarea
    create: (payload) => request('', {
        method: 'POST',
        body: payload
    }),
    
    // Actualizar tarea
    update: (id, payload) => request(`/${id}`, {
        method: 'PUT',
        body: payload
    }),
    
    // Eliminar tarea
    delete: (id) => request(`/${id}`, {
        method: 'DELETE'
    }),
    
    // Marcar tarea como completada
    complete: (id) => request(`/${id}/complete`, {
        method: 'PUT'
    }),
    
    // Marcar tarea como pendiente
    uncomplete: (id) => request(`/${id}/uncomplete`, {
        method: 'PUT'
    }),
    
    // Marcar todas como completadas
    completeAll: () => request('/complete/all', {
        method: 'PUT'
    }),
    
    // Eliminar todas las completadas
    deleteCompleted: () => request('/completed', {
        method: 'DELETE'
    })
}