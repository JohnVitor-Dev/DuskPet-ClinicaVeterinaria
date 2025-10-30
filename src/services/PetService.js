import apiClient from '../api/client.js';
import { API_ENDPOINTS, API_CONFIG } from '../config/api.js';
import { logger } from '../utils/logger.js';

const PETS_CACHE_KEY = 'pets_cache_v2';
const PETS_IMAGES_CACHE_KEY = 'pets_images_cache_v2';
const CACHE_EXPIRATION_MS = 1000 * 60 * 30;

function setCachedPets(data) {
    try {
        const payload = {
            data,
            ts: Date.now(),
            version: 2
        };
        localStorage.setItem(PETS_CACHE_KEY, JSON.stringify(payload));
    } catch (error) {
        logger.warn('Erro ao salvar cache de pets:', error);
    }
}

function getCachedPets(ignoreExpiration = false) {
    try {
        const raw = localStorage.getItem(PETS_CACHE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.data)) return null;

        const isExpired = (Date.now() - parsed.ts) > CACHE_EXPIRATION_MS;
        if (isExpired && !ignoreExpiration) {
            clearCachedPets();
            return null;
        }

        return parsed;
    } catch (error) {
        logger.warn('Erro ao ler cache de pets:', error);
        return null;
    }
}

function clearCachedPets() {
    try {
        localStorage.removeItem(PETS_CACHE_KEY);
        localStorage.removeItem(PETS_IMAGES_CACHE_KEY);
        logger.log('🧹 Cache de pets e imagens limpo');
    } catch (_) { }
}

async function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function setCachedPetImage(petId, imageBase64) {
    try {
        const existing = localStorage.getItem(PETS_IMAGES_CACHE_KEY);
        const cache = existing ? JSON.parse(existing) : {};
        cache[petId] = {
            data: imageBase64,
            ts: Date.now()
        };
        localStorage.setItem(PETS_IMAGES_CACHE_KEY, JSON.stringify(cache));
        logger.log(`💾 Imagem do pet ${petId} salva no cache (${(imageBase64.length / 1024).toFixed(2)} KB)`);
    } catch (error) {
        logger.warn('Erro ao salvar cache de imagem:', error);
        if (error.name === 'QuotaExceededError') {
            logger.warn('⚠️ Quota excedida, limpando cache de imagens antigas');
            clearOldImageCache(petId, imageBase64);
        }
    }
}

function clearOldImageCache(keepPetId = null, keepImageData = null) {
    try {
        if (keepPetId && keepImageData) {
            const cache = { [keepPetId]: { data: keepImageData, ts: Date.now() } };
            localStorage.setItem(PETS_IMAGES_CACHE_KEY, JSON.stringify(cache));
        } else {
            localStorage.removeItem(PETS_IMAGES_CACHE_KEY);
        }
    } catch (error) {
        logger.warn('Erro ao limpar cache de imagens:', error);
    }
}

function getCachedPetImage(petId) {
    try {
        const raw = localStorage.getItem(PETS_IMAGES_CACHE_KEY);
        if (!raw) return null;

        const cache = JSON.parse(raw);
        const imageCache = cache[petId];

        if (!imageCache) return null;

        const isExpired = (Date.now() - imageCache.ts) > (1000 * 60 * 60);
        if (isExpired) {
            delete cache[petId];
            localStorage.setItem(PETS_IMAGES_CACHE_KEY, JSON.stringify(cache));
            return null;
        }

        return imageCache.data;
    } catch (error) {
        logger.warn('Erro ao ler cache de imagem:', error);
        return null;
    }
}

const PetService = {
    async listPets(forceRefresh = false) {
        if (!forceRefresh) {
            const cache = getCachedPets();
            if (cache) {
                logger.log('📦 Carregando pets do cache local');
                return {
                    success: true,
                    data: cache.data,
                    fromCache: true,
                    cachedAt: new Date(cache.ts).toLocaleString()
                };
            }
        }

        try {
            logger.log('🌐 Buscando pets do servidor...');
            const response = await apiClient.get(API_ENDPOINTS.PETS);
            setCachedPets(response);
            return { success: true, data: response, fromCache: false };
        } catch (error) {
            logger.warn('⚠️ Erro ao buscar pets do servidor:', error.message);
            const cache = getCachedPets(true);
            if (cache) {
                logger.log('📦 Usando cache expirado como fallback');
                return {
                    success: true,
                    data: cache.data,
                    fromCache: true,
                    isStale: true,
                    cachedAt: new Date(cache.ts).toLocaleString()
                };
            }
            return {
                success: false,
                error: error.message,
                status: error.status
            };
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
            let bodyToSend = petData;
            if (!(petData instanceof FormData) && petData?.imagem instanceof File) {
                const fd = new FormData();
                Object.entries(petData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        fd.append(key, value);
                    }
                });
                bodyToSend = fd;
            }

            logger.log('PetService - Enviando:', bodyToSend instanceof FormData ? '[FormData]' : bodyToSend);
            const response = await apiClient.post(API_ENDPOINTS.PETS, bodyToSend);
            logger.log('PetService - Resposta:', response);

            const cache = getCachedPets(true);
            if (cache) {
                const updatedPets = [...(cache.data || []), response];
                setCachedPets(updatedPets);
                logger.log('✅ Cache atualizado com novo pet');
            }

            return { success: true, data: response };
        } catch (error) {
            logger.error('PetService - Erro completo:', error);
            logger.error('PetService - Erro data:', error.data);
            return {
                success: false,
                error: error.message,
                details: error.data?.details || []
            };
        }
    },

    async updatePet(id, petData) {
        try {
            let bodyToSend = petData;
            if (!(petData instanceof FormData) && petData?.imagem instanceof File) {
                const fd = new FormData();
                Object.entries(petData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        fd.append(key, value);
                    }
                });
                bodyToSend = fd;
            }

            const response = await apiClient.put(API_ENDPOINTS.PET_DETAIL(id), bodyToSend);

            const cache = getCachedPets(true);
            if (cache) {
                const updatedPets = (cache.data || []).map(p =>
                    p.id === id ? { ...p, ...response } : p
                );
                setCachedPets(updatedPets);
                logger.log('✅ Cache atualizado com pet editado');
            }

            return { success: true, data: response };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                details: error.data?.details || []
            };
        }
    },

    async deletePet(id) {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.PET_DETAIL(id));

            const cache = getCachedPets(true);
            if (cache) {
                const updatedPets = (cache.data || []).filter(p => p.id !== id);
                setCachedPets(updatedPets);
                logger.log('✅ Cache atualizado - pet removido');
            }

            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    getPetImageUrl(id) {
        return `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PET_IMAGE(id)}`;
    },

    async fetchPetImageObjectUrl(id) {
        try {
            const cachedImageBase64 = getCachedPetImage(id);
            if (cachedImageBase64) {
                logger.log(`📦 Carregando imagem do pet ${id} do cache`);
                return { success: true, data: cachedImageBase64, fromCache: true };
            }

            logger.log(`🌐 Baixando imagem do pet ${id} do servidor`);
            const blob = await apiClient.getBlob(API_ENDPOINTS.PET_IMAGE(id));

            const base64 = await blobToBase64(blob);

            setCachedPetImage(id, base64);

            return { success: true, data: base64, fromCache: false };
        } catch (error) {
            logger.warn(`⚠️ Erro ao carregar imagem do pet ${id}:`, error.message);
            return { success: false, error: error.message };
        }
    },

    getCachedPets,
    setCachedPets,
    clearCachedPets,
    getCachedPetImage,
    setCachedPetImage
};

export default PetService;
