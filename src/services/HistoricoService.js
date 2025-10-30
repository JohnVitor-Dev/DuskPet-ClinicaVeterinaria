import apiClient from '../api/client.js';
import { API_ENDPOINTS } from '../config/api.js';

const HistoricoService = {
    async listByPet(petId, completo = false) {
        try {
            const endpoint = completo
                ? API_ENDPOINTS.HISTORICOS_PET_COMPLETO(petId)
                : API_ENDPOINTS.HISTORICOS_PET(petId);
            const response = await apiClient.get(endpoint);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getHistorico(id) {
        try {
            const response = await apiClient.get(API_ENDPOINTS.HISTORICO_DETAIL(id));
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async createHistorico(data) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.HISTORICOS, data);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message, details: error.data?.details || [] };
        }
    },

    async updateHistorico(id, data) {
        try {
            const response = await apiClient.put(API_ENDPOINTS.HISTORICO_DETAIL(id), data);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message, details: error.data?.details || [] };
        }
    },

    async deleteHistorico(id) {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.HISTORICO_DETAIL(id));
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

export default HistoricoService;
