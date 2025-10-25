import apiClient from '../api/client.js';
import { API_ENDPOINTS } from '../config/api.js';

const ProdutoService = {
    async listProdutos() {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PRODUTOS);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getProduto(id) {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PRODUTO_DETAIL(id));
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getRelatorioEstoque() {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PRODUTOS_RELATORIO_ESTOQUE);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

export default ProdutoService;
