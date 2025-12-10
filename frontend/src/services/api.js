// api.js
const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:8000";

console.log('🔧 API_URL configurada como:', API_URL);

function buildUrl(endpoint = '') {
    // Quitar slash final de baseUrl y slash inicial de endpoint
    let baseUrl = API_URL.replace(/\/$/, '');
    endpoint = endpoint.replace(/^\/+/, '');

    // Si la URL ya incluye /api/todos, no agregarla otra vez
    if (baseUrl.includes('/api/todos')) {
        return endpoint ? `${baseUrl}/${endpoint}` : baseUrl;
    }

    // Si no incluye /api/todos, agregarla
    return endpoint ? `${baseUrl}/api/todos/${endpoint}` : `${baseUrl}/api/todos`;
}

async function request(endpoint = '', options = {}) {
    const url = buildUrl(endpoint);

    console.log('🌐 Haciendo request a:', url, 'Options:', options.method || 'GET');

    const config = { headers: { 'Content-Type': 'application/json' }, ...options };

    // Agregar body si existe y no es string
    if (config.body && typeof config.body !== 'string') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        console.log('📡 Response status:', response.status, 'URL:', url);

        if (!response.ok) {
            let errorMessage = `Error ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch {
                try {
                    const text = await response.text();
                    if (text) errorMessage = text;
                } catch {}
            }
            throw new Error(errorMessage);
        }

        // Para DELETE (204 No Content)
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error('❌ Error en API:', error.message, 'URL:', url);
        throw error;
    }
}

export default {
    list: () => request(''),
    getCompleted: () => request('completed'),
    get: (id) => request(`${id}`),
    create: (payload) => request('', { method: 'POST', body: payload }),
    update: (id, payload) => request(`${id}`, { method: 'PUT', body: payload }),
    delete: (id) => request(`${id}`, { method: 'DELETE' }),
    complete: (id) => request(`${id}/complete`, { method: 'PUT' }),
    uncomplete: (id) => request(`${id}/uncomplete`, { method: 'PUT' }),
    completeAll: () => request('complete/all', { method: 'PUT' }),
    deleteCompleted: () => request('completed', { method: 'DELETE' }),
};
