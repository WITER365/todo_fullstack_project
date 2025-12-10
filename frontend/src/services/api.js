const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

async function request(endpoint = '', options = {}) {
    // Si API_URL ya incluye /api/todos, no lo agregues de nuevo
    let baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
    
    // Verificar si la baseUrl ya incluye /api/todos
    let url;
    if (baseUrl.includes('/api/todos')) {
        // Si ya tiene /api/todos, solo agrega el endpoint
        url = `${baseUrl}${endpoint}`;
    } else {
        // Si no tiene /api/todos, agregarlo
        url = `${baseUrl}/api/todos${endpoint}`;
    }
    
    console.log('🌐 API Request URL:', url); // Para debug
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };
    
    // Convertir body a JSON si es un objeto
    if (config.body && typeof config.body !== 'string') {
        config.body = JSON.stringify(config.body);
    }
    
    try {
        const response = await fetch(url, config);
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            let errorMessage = `Error ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch {
                // Si no es JSON, intentar texto
                try {
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                } catch {
                    // Ignorar
                }
            }
            throw new Error(errorMessage);
        }
        
        // Para DELETE (204 No Content)
        if (response.status === 204) {
            return null;
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ API Error:', error.message, 'URL:', url);
        throw error;
    }
}

export default {
    // Obtener todas las tareas
    list: () => request(''),
    
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
    })
};