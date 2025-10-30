import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import { API_ENDPOINTS } from "../config/api";
import { logger } from "../utils/logger";
import "../styles/components/UserProfile.css";

export default function UserProfile() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoadingProfile(true);
            const response = await apiClient.get(API_ENDPOINTS.PROFILE);

            setFormData({
                name: response.name || "",
                email: response.email || "",
                phone: response.phone || ""
            });
        } catch (err) {
            logger.error("Erro ao carregar perfil:", err);
            if (user) {
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || ""
                });
            }
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length === 0) return "";
        if (numbers.length <= 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        }
        return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setFormData(prev => ({ ...prev, phone: formatted }));
        setError(null);
    };

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setSuccessMessage("");
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone.replace(/\D/g, "")
            };

            const response = await apiClient.put(API_ENDPOINTS.PROFILE, dataToSend);

            if (response) {
                updateUser({
                    name: response.name || formData.name,
                    email: response.email || formData.email,
                    phone: response.phone || formData.phone
                });

                showSuccessMessage("Perfil atualizado com sucesso!");
                setIsEditing(false);

                await loadProfile();
            }
        } catch (err) {
            logger.error("Erro ao atualizar perfil:", err);
            setError(err.response?.data?.message || err.message || "Erro ao atualizar perfil. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!passwordData.currentPassword) {
            setError("Por favor, informe sua senha atual.");
            setLoading(false);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("A nova senha e a confirmação não coincidem.");
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("A nova senha deve ter no mínimo 6 caracteres.");
            setLoading(false);
            return;
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            setError("A nova senha deve ser diferente da senha atual.");
            setLoading(false);
            return;
        }

        try {
            try {
                await apiClient.post(API_ENDPOINTS.LOGIN, {
                    email: user.email,
                    password: passwordData.currentPassword
                });
            } catch (loginErr) {
                setError("Senha atual incorreta. Verifique e tente novamente.");
                setLoading(false);
                return;
            }

            await apiClient.put(API_ENDPOINTS.PROFILE, {
                password: passwordData.newPassword
            });

            showSuccessMessage("Senha alterada com sucesso!");
            setShowPasswordModal(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            logger.error("Erro ao alterar senha:", err);
            setError(err.response?.data?.message || err.message || "Erro ao alterar senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || ""
            });
        }
        setError(null);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setError(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            if (showPasswordModal) {
                handleClosePasswordModal();
            }
        }
    };

    useEffect(() => {
        if (showPasswordModal) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [showPasswordModal]);

    return (
        <>
            <NavBar />
            <div className="page-wrapper">
                <main className="profile-container page-bg-pattern">
                    {success && (
                        <div className="success-toast">
                            <span className="material-symbols-outlined">check_circle</span>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <div className="profile-header">
                        <div className="header-content">
                            <span className="material-symbols-outlined">account_circle</span>
                            <h1>Meu Perfil</h1>
                        </div>
                    </div>

                    {loadingProfile ? (
                        <div className="profile-loading">
                            <span className="material-symbols-outlined spinning">progress_activity</span>
                            <p>Carregando perfil...</p>
                        </div>
                    ) : (
                        <div className="profile-content">
                            <div className="profile-card">
                                <div className="profile-avatar-section">
                                    <div className="profile-avatar">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div className="profile-info-header">
                                        <h2>{user?.name || "Usuário"}</h2>
                                        <p className="profile-role">
                                            <span className="material-symbols-outlined">
                                                {user?.role === 'admin' && 'shield_person'}
                                                {user?.role === 'atendente' && 'support_agent'}
                                                {user?.role === 'cliente' && 'person'}
                                            </span>
                                            {user?.role === 'admin' && 'Administrador'}
                                            {user?.role === 'atendente' && 'Atendente'}
                                            {user?.role === 'cliente' && 'Cliente'}
                                        </p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="error-message">
                                        <span className="material-symbols-outlined">error</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="profile-form">
                                    <div className="form-section">
                                        <h3>
                                            <span className="material-symbols-outlined">badge</span>
                                            Informações Pessoais
                                        </h3>

                                        <div className="form-group">
                                            <label htmlFor="name">Nome Completo *</label>
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                required
                                                placeholder="Seu nome completo"
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="email">Email *</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    required
                                                    placeholder="seu@email.com"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="phone">Telefone</label>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handlePhoneChange}
                                                    disabled={!isEditing}
                                                    maxLength={15}
                                                    placeholder="(00) 00000-0000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h3>
                                            <span className="material-symbols-outlined">lock</span>
                                            Segurança
                                        </h3>

                                        <button
                                            type="button"
                                            className="change-password-btn"
                                            onClick={() => setShowPasswordModal(true)}
                                        >
                                            <span className="material-symbols-outlined">vpn_key</span>
                                            Alterar Senha
                                        </button>
                                    </div>

                                    <div className="form-actions">
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                className="btn-primary"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                                Editar Perfil
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={handleCancel}
                                                    disabled={loading}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn-primary"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="material-symbols-outlined spinning">progress_activity</span>
                                                            Salvando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined">save</span>
                                                            Salvar Alterações
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showPasswordModal && (
                        <div className="modal-overlay" onClick={handleClosePasswordModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Alterar Senha</h2>
                                    <button
                                        className="close-btn"
                                        onClick={handleClosePasswordModal}
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <form onSubmit={handlePasswordSubmit} className="password-form">
                                    {error && (
                                        <div className="error-message">
                                            <span className="material-symbols-outlined">error</span>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Senha Atual *</label>
                                        <input
                                            id="currentPassword"
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                            placeholder="Sua senha atual"
                                            autoComplete="current-password"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="newPassword">Nova Senha *</label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                            placeholder="Mínimo 6 caracteres"
                                            autoComplete="new-password"
                                        />
                                        <small>Mínimo de 6 caracteres</small>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirmar Nova Senha *</label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                            placeholder="Digite a senha novamente"
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={handleClosePasswordModal}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="material-symbols-outlined spinning">progress_activity</span>
                                                    Alterando...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined">vpn_key</span>
                                                    Alterar Senha
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
