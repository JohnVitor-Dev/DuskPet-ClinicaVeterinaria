import apiClient from '../api/client.js';
import { API_ENDPOINTS } from '../config/api.js';

const AgendamentoService = {
    async listAgendamentos() {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AGENDAMENTOS);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getAgendamento(id) {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AGENDAMENTO_DETAIL(id));
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async createAgendamento(agendamentoData) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AGENDAMENTOS, agendamentoData);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async updateAgendamento(id, agendamentoData) {
        try {
            const response = await apiClient.put(API_ENDPOINTS.AGENDAMENTO_DETAIL(id), agendamentoData);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async cancelAgendamento(id) {
        try {
            const response = await apiClient.patch(API_ENDPOINTS.AGENDAMENTO_CANCEL(id));
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getHorariosDisponiveis(params) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await apiClient.get(`${API_ENDPOINTS.HORARIOS_DISPONIVEIS}?${queryString}`);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

export default AgendamentoService;
