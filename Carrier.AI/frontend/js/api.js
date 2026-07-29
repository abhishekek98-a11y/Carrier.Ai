// frontend/js/api.js
import { showToast } from './utils.js';

const API_BASE = 'http://localhost:8000/api';

export function getToken() {
    return localStorage.getItem('access_token');
}

export function setToken(token) {
    localStorage.setItem('access_token', token);
}

export function removeToken() {
    localStorage.removeItem('access_token');
}

export function isAuthenticated() {
    return !!getToken();
}

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    const headers = {
        ...options.headers,
    };

    if (getToken()) {
        headers['Authorization'] = `Bearer ${getToken()}`;
    }

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        if (options.body && typeof options.body === 'object') {
            options.body = JSON.stringify(options.body);
        }
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        
        if (response.status === 401) {
            removeToken();
            window.location.hash = '#login';
            throw new Error('Session expired. Please login again.');
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMsg = data.detail || data.message || 'An error occurred';
            throw new Error(errorMsg);
        }

        return data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
}

export const api = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body }),
    upload: (endpoint, formData) => apiRequest(endpoint, { method: 'POST', body: formData }),
};
