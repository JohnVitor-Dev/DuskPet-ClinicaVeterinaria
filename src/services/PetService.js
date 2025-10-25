import apiClient from '../api/client.js';
import { API_ENDPOINTS } from '../config/api.js';

const PetService = {
    async listPets() {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PETS);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getPet(id) {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PET_DETAIL(id));
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async createPet(petData) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.PETS, petData);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async updatePet(id, petData) {
        try {
            const response = await apiClient.put(API_ENDPOINTS.PET_DETAIL(id), petData);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async deletePet(id) {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.PET_DETAIL(id));
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

export default PetService;
