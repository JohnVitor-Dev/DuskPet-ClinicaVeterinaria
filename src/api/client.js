import { API_CONFIG } from '../config/api.js';

export class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

class APIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    getAuthToken() {
        return localStorage.getItem('token');
    }

    setAuthToken(token) {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    clearAuthToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getHeaders(customHeaders = {}) {
        const headers = {
            ...API_CONFIG.DEFAULT_HEADERS,
            ...customHeaders,
        };

        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    getURL(endpoint) {
        return `${this.baseURL}${endpoint}`;
    }

    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        const isJSON = contentType && contentType.includes('application/json');

        let data;
        if (isJSON) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        console.log('API Response:', {
            status: response.status,
            statusText: response.statusText,
            data: data
        });

        if (!response.ok) {
            if (response.status === 401) {
                this.clearAuthToken();
                window.location.href = '/login';
            }

            throw new APIError(
                data.message || data.error || 'Erro na requisição',
                response.status,
                data
            );
        }

        return data;
    }

    async get(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(this.getURL(endpoint), {
                method: 'GET',
                headers: this.getHeaders(options.headers),
                signal: controller.signal,
                ...options,
            });

            return await this.handleResponse(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new APIError('Requisição expirou', 408);
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async post(endpoint, body, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const isFormData = body instanceof FormData;
            const headers = isFormData
                ? this.getHeaders({ ...options.headers, 'Content-Type': undefined })
                : this.getHeaders(options.headers);

            if (isFormData) {
                delete headers['Content-Type'];
            }

            const bodyToSend = isFormData ? body : JSON.stringify(body);

            console.log('POST Request:', {
                url: this.getURL(endpoint),
                headers: headers,
                body: body,
                bodyToSend: isFormData ? '[FormData]' : bodyToSend,
                isFormData
            });

            const response = await fetch(this.getURL(endpoint), {
                method: 'POST',
                headers: headers,
                body: bodyToSend,
                signal: controller.signal,
                ...options,
            });

            return await this.handleResponse(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new APIError('Requisição expirou', 408);
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async put(endpoint, body, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const isFormData = body instanceof FormData;
            const headers = isFormData
                ? this.getHeaders({ ...options.headers, 'Content-Type': undefined })
                : this.getHeaders(options.headers);

            if (isFormData) {
                delete headers['Content-Type'];
            }

            const response = await fetch(this.getURL(endpoint), {
                method: 'PUT',
                headers: headers,
                body: isFormData ? body : JSON.stringify(body),
                signal: controller.signal,
                ...options,
            });

            return await this.handleResponse(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new APIError('Requisição expirou', 408);
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async patch(endpoint, body, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(this.getURL(endpoint), {
                method: 'PATCH',
                headers: this.getHeaders(options.headers),
                body: JSON.stringify(body),
                signal: controller.signal,
                ...options,
            });

            return await this.handleResponse(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new APIError('Requisição expirou', 408);
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async delete(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(this.getURL(endpoint), {
                method: 'DELETE',
                headers: this.getHeaders(options.headers),
                signal: controller.signal,
                ...options,
            });

            return await this.handleResponse(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new APIError('Requisição expirou', 408);
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }
}

const apiClient = new APIClient();
export default apiClient;
