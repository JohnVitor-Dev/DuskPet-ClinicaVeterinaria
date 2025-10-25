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
};

export default VeterinarioService;
