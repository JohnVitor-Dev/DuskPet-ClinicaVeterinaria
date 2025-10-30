import apiClient from '../api/client.js';
import { API_ENDPOINTS } from '../config/api.js';

const VeterinarioService = {
    async listVeterinarios(especialidade = null) {
        try {
            const endpoint = especialidade
                ? `${API_ENDPOINTS.VETERINARIOS_PUBLIC}?especialidade=${especialidade}`
                : API_ENDPOINTS.VETERINARIOS_PUBLIC;

            const response = await apiClient.get(endpoint);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getVeterinario(id) {
        try {
            const response = await apiClient.get(API_ENDPOINTS.VETERINARIO_PUBLIC_DETAIL(id));
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async createVeterinario(data) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.ADMIN_VETERINARIOS, data);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message, details: error.details };
        }
    },

    async updateVeterinario(id, data) {
        try {
            const response = await apiClient.put(API_ENDPOINTS.ADMIN_VETERINARIO_DETAIL(id), data);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message, details: error.details };
        }
    },

    async deleteVeterinario(id) {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.ADMIN_VETERINARIO_DETAIL(id));
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async listVeterinariosAdmin() {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ADMIN_VETERINARIOS);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async listVeterinariosAtendente() {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ATENDENTE_VETERINARIOS);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

export default VeterinarioService;
