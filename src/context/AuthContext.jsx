import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client.js';
import { API_ENDPOINTS } from '../config/api.js';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            try {
                const token = localStorage.getItem('token');
                const savedUser = localStorage.getItem('user');

                if (token && savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (err) {
                console.error('Erro ao carregar usuário:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });

            console.log('📥 Resposta completa da API (Login):', response);

            apiClient.setAuthToken(response.token);

            try {
                console.log('🔍 Buscando dados do perfil...');
                const profileResponse = await apiClient.get(API_ENDPOINTS.PROFILE);
                console.log('📥 Dados do perfil:', profileResponse);

                const userData = {
                    id: profileResponse.id,
                    name: profileResponse.name,
                    email: profileResponse.email || email,
                    phone: profileResponse.phone,
                    role: 'cliente',
                };

                console.log('✅ Dados do usuário salvos (Login):', userData);

                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);

                return { success: true, user: userData };
            } catch (profileErr) {
                console.error('❌ Erro ao buscar perfil:', profileErr);
                const minimalUserData = {
                    id: null,
                    name: '',
                    email: email,
                    phone: '',
                    role: 'cliente',
                };
                localStorage.setItem('user', JSON.stringify(minimalUserData));
                setUser(minimalUserData);
                return { success: true, user: minimalUserData };
            }
        } catch (err) {
            console.error('❌ Erro no login:', err);
            const errorMessage = err.message || 'Erro ao fazer login';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }; const loginAdmin = async (email, senha) => {
        try {
            setError(null);
            setLoading(true);

            const response = await apiClient.post(API_ENDPOINTS.ADMIN_LOGIN, {
                email,
                senha,
            });

            apiClient.setAuthToken(response.token);

            const userData = {
                id: response.admin.id,
                name: response.admin.nome,
                email: response.admin.email,
                role: 'admin',
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, user: userData };
        } catch (err) {
            const errorMessage = err.message || 'Erro ao fazer login de admin';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const loginAtendente = async (email, senha) => {
        try {
            setError(null);
            setLoading(true);

            const response = await apiClient.post(API_ENDPOINTS.ATENDENTE_LOGIN, {
                email,
                senha,
            });

            apiClient.setAuthToken(response.token);

            const userData = {
                id: response.atendente.id,
                name: response.atendente.nome,
                email: response.atendente.email,
                role: 'atendente',
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, user: userData };
        } catch (err) {
            const errorMessage = err.message || 'Erro ao fazer login de atendente';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, phone, email, password) => {
        try {
            setError(null);
            setLoading(true);

            const response = await apiClient.post(API_ENDPOINTS.REGISTER, {
                name,
                phone,
                email,
                password,
            });

            console.log('📥 Resposta completa da API (Register):', response);

            apiClient.setAuthToken(response.token);

            try {
                console.log('🔍 Buscando dados do perfil...');
                const profileResponse = await apiClient.get(API_ENDPOINTS.PROFILE);
                console.log('📥 Dados do perfil:', profileResponse);

                const userData = {
                    id: profileResponse.id,
                    name: profileResponse.name || name,
                    email: profileResponse.email || email,
                    phone: profileResponse.phone || phone,
                    role: 'cliente',
                };

                console.log('✅ Dados do usuário salvos (Register):', userData);

                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);

                return { success: true, user: userData };
            } catch (profileErr) {
                console.error('❌ Erro ao buscar perfil:', profileErr);
                const minimalUserData = {
                    id: null,
                    name: name,
                    email: email,
                    phone: phone,
                    role: 'cliente',
                };
                localStorage.setItem('user', JSON.stringify(minimalUserData));
                setUser(minimalUserData);
                return { success: true, user: minimalUserData };
            }
        } catch (err) {
            console.error('❌ Erro no registro:', err);
            const errorMessage = err.message || 'Erro ao fazer cadastro';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }; const logout = () => {
        apiClient.clearAuthToken();
        setUser(null);
        setError(null);
    };

    const updateProfile = async (updates) => {
        try {
            setError(null);
            setLoading(true);

            const response = await apiClient.put(API_ENDPOINTS.PROFILE, updates);

            const updatedUser = {
                ...user,
                ...response.user,
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return { success: true, user: updatedUser };
        } catch (err) {
            const errorMessage = err.message || 'Erro ao atualizar perfil';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            setError(null);
            setLoading(true);

            const response = await apiClient.get(API_ENDPOINTS.PROFILE);

            const userData = {
                id: response.id,
                name: response.name,
                email: response.email,
                phone: response.phone,
                role: user?.role || 'cliente',
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, user: userData };
        } catch (err) {
            const errorMessage = err.message || 'Erro ao buscar perfil';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = () => {
        return !!user && !!apiClient.getAuthToken();
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        loading,
        error,
        login,
        loginAdmin,
        loginAtendente,
        register,
        logout,
        updateProfile,
        fetchProfile,
        isAuthenticated,
        hasRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
