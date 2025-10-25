/**
 * 🌐 API Module
 * Backend API entegrasyonu ve HTTP istekleri
 */

class APIClient {
    constructor() {
        this.baseURL = window.Config?.api?.baseUrl || 'https://api.zuhalmuzik.com';
        this.timeout = 30000;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        this.init();
    }

    /**
     * API Client'ı başlat
     */
    init() {
        console.log('🌐 APIClient initialized');
    }

    /**
     * Authorization header ekle
     */
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        if (token) {
            return {
                ...this.defaultHeaders,
                'Authorization': `Bearer ${token}`
            };
        }
        return this.defaultHeaders;
    }

    /**
     * HTTP GET request
     */
    async get(endpoint, options = {}) {
        try {
            // Rate limiting kontrolü
            if (window.RateLimiter && !window.RateLimiter.canMakeRequest('api')) {
                throw new Error('Çok fazla istek. Lütfen bekleyin.');
            }

            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders(),
                ...options
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * HTTP POST request
     */
    async post(endpoint, data, options = {}) {
        try {
            // Rate limiting kontrolü
            if (window.RateLimiter && !window.RateLimiter.canMakeRequest('api')) {
                throw new Error('Çok fazla istek. Lütfen bekleyin.');
            }

            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
                ...options
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * HTTP PUT request
     */
    async put(endpoint, data, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
                ...options
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * HTTP DELETE request
     */
    async delete(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getAuthHeaders(),
                ...options
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Response handler
     */
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText
            }));
            throw new Error(error.message || 'API request failed');
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    }

    /**
     * Error handler
     */
    handleError(error) {
        console.error('API Error:', error);
        
        if (window.ErrorHandler) {
            window.ErrorHandler.handleNetworkError(error);
        }

        throw error;
    }

    /**
     * Authentication endpoints
     */
    auth = {
        login: async (email, password) => {
            return await this.post('/auth/login', { email, password });
        },
        
        logout: async () => {
            return await this.post('/auth/logout');
        },
        
        verify: async () => {
            return await this.get('/auth/verify');
        },
        
        refresh: async () => {
            return await this.post('/auth/refresh');
        }
    };

    /**
     * Data endpoints
     */
    data = {
        getMetadata: async () => {
            return await this.get('/data/metadata');
        },
        
        getYearData: async (year) => {
            return await this.get(`/data/year/${year}`);
        },
        
        getTargets: async () => {
            return await this.get('/data/targets');
        },
        
        getInventory: async () => {
            return await this.get('/data/inventory');
        }
    };

    /**
     * User endpoints
     */
    user = {
        getProfile: async () => {
            return await this.get('/user/profile');
        },
        
        updateProfile: async (data) => {
            return await this.put('/user/profile', data);
        }
    };
}

// Global APIClient instance oluştur
window.APIClient = new APIClient();

console.log('🌐 API module loaded successfully');
