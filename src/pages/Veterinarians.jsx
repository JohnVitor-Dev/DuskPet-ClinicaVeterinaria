import { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import VeterinarioService from '../services/VeterinarioService';
import { useAuth } from '../context/AuthContext';
import '../styles/components/Veterinarians.css';

export default function Veterinarians() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isAtendente = user?.role === 'atendente';
    const canManage = isAdmin;

    const [veterinarios, setVeterinarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedVet, setSelectedVet] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [vetDetails, setVetDetails] = useState(null);
    const [filterEspecialidade, setFilterEspecialidade] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        crmv: "",
        especialidades: "",
        horarios_trabalho: {}
    });
    const [horariosDia, setHorariosDia] = useState({
        segunda: [],
        terca: [],
        quarta: [],
        quinta: [],
        sexta: [],
        sabado: [],
        domingo: []
    });

    const especialidadesOptions = [
        "Clínica Geral",
        "Cirurgia",
        "Dermatologia",
        "Cardiologia",
        "Oftalmologia",
        "Ortopedia",
        "Neurologia",
        "Oncologia",
        "Odontologia",
        "Exóticos"
    ];

    const diasSemana = [
        { key: 'segunda', label: 'Segunda-feira' },
        { key: 'terca', label: 'Terça-feira' },
        { key: 'quarta', label: 'Quarta-feira' },
        { key: 'quinta', label: 'Quinta-feira' },
        { key: 'sexta', label: 'Sexta-feira' },
        { key: 'sabado', label: 'Sábado' },
        { key: 'domingo', label: 'Domingo' }
    ];

    useEffect(() => {
        loadVeterinarios();
    }, []);

    useEffect(() => {
        if (filterEspecialidade) {
            loadVeterinarios();
        } else {
            loadVeterinarios();
        }
    }, [filterEspecialidade]);

    const loadVeterinarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await VeterinarioService.listVeterinarios(filterEspecialidade || null);
            if (result.success) {
                setVeterinarios(result.data);
            } else {
                setError('Erro ao carregar veterinários: ' + result.error);
            }
        } catch (err) {
            setError('Erro inesperado ao carregar veterinários.');
        } finally {
            setLoading(false);
        }
    };

    const formatCPF = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return value;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cpf') {
            setFormData(prev => ({
                ...prev,
                [name]: formatCPF(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleEspecialidadesChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            especialidades: value
        }));
    };

    const addHorario = (dia) => {
        setHorariosDia(prev => ({
            ...prev,
            [dia]: [...prev[dia], { inicio: '', fim: '' }]
        }));
    };

    const removeHorario = (dia, index) => {
        setHorariosDia(prev => ({
            ...prev,
            [dia]: prev[dia].filter((_, i) => i !== index)
        }));
    };

    const updateHorario = (dia, index, field, value) => {
        setHorariosDia(prev => ({
            ...prev,
            [dia]: prev[dia].map((h, i) =>
                i === index ? { ...h, [field]: value } : h
            )
        }));
    };

    const buildHorariosTrabalho = () => {
        const horarios = {};
        Object.keys(horariosDia).forEach(dia => {
            const horariosValidos = horariosDia[dia]
                .filter(h => h.inicio && h.fim)
                .map(h => `${h.inicio}-${h.fim}`);
            if (horariosValidos.length > 0) {
                horarios[dia] = horariosValidos;
            }
        });
        return horarios;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const especialidadesArray = formData.especialidades
                .split(',')
                .map(e => e.trim())
                .filter(e => e);

            const submitData = {
                nome: formData.nome.trim(),
                cpf: formData.cpf.trim(),
                crmv: formData.crmv.trim(),
                especialidades: especialidadesArray,
                horarios_trabalho: buildHorariosTrabalho()
            };

            const result = isEditing && selectedVet
                ? await VeterinarioService.updateVeterinario(selectedVet.id, submitData)
                : await VeterinarioService.createVeterinario(submitData);

            if (result.success) {
                setSuccessMessage(isEditing ? 'Veterinário atualizado com sucesso!' : 'Veterinário criado com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
                handleCloseModal();
                await loadVeterinarios();
            } else {
                setError(`Erro ao ${isEditing ? 'atualizar' : 'criar'} veterinário: ${result.error}`);
            }
        } catch (err) {
            setError(`Erro inesperado: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja remover este veterinário?')) return;

        setError(null);
        const result = await VeterinarioService.deleteVeterinario(id);
        if (result.success) {
            setSuccessMessage('Veterinário removido com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
            await loadVeterinarios();
        } else {
            setError('Erro ao remover veterinário: ' + result.error);
        }
    };

    const handleEditClick = (vet) => {
        setIsEditing(true);
        setSelectedVet(vet);
        setFormData({
            nome: vet.nome || '',
            cpf: vet.cpf || '',
            crmv: vet.crmv || '',
            especialidades: Array.isArray(vet.especialidades)
                ? vet.especialidades.join(', ')
                : '',
            horarios_trabalho: vet.horarios_trabalho || {}
        });

        const parsedHorarios = {
            segunda: [],
            terca: [],
            quarta: [],
            quinta: [],
            sexta: [],
            sabado: [],
            domingo: []
        };

        if (vet.horarios_trabalho) {
            Object.keys(vet.horarios_trabalho).forEach(dia => {
                if (Array.isArray(vet.horarios_trabalho[dia])) {
                    parsedHorarios[dia] = vet.horarios_trabalho[dia].map(horario => {
                        const [inicio, fim] = horario.split('-');
                        return { inicio, fim };
                    });
                }
            });
        }

        setHorariosDia(parsedHorarios);
        setShowModal(true);
    };

    const handleOpenCreate = () => {
        setIsEditing(false);
        setSelectedVet(null);
        setFormData({
            nome: "",
            cpf: "",
            crmv: "",
            especialidades: "",
            horarios_trabalho: {}
        });
        setHorariosDia({
            segunda: [],
            terca: [],
            quarta: [],
            quinta: [],
            sexta: [],
            sabado: [],
            domingo: []
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedVet(null);
        setFormData({
            nome: "",
            cpf: "",
            crmv: "",
            especialidades: "",
            horarios_trabalho: {}
        });
        setHorariosDia({
            segunda: [],
            terca: [],
            quarta: [],
            quinta: [],
            sexta: [],
            sabado: [],
            domingo: []
        });
        setIsSubmitting(false);
        setError(null);
    };

    const openDetails = async (vet) => {
        setShowDetails(true);
        setDetailsLoading(true);
        setVetDetails(null);
        setError(null);

        const result = await VeterinarioService.getVeterinario(vet.id);
        if (result.success) {
            setVetDetails(result.data);
        } else {
            setError('Não foi possível carregar os detalhes do veterinário.');
            setShowDetails(false);
        }
        setDetailsLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            if (showDetails) {
                setShowDetails(false);
            } else if (showModal) {
                handleCloseModal();
            }
        }
    };

    useEffect(() => {
        if (showModal || showDetails) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [showModal, showDetails]);

    return (
        <>
            <NavBar />
            <div className="veterinarians-container page-bg-pattern">
                {successMessage && (
                    <div className="success-toast">
                        <span className="material-symbols-outlined">check_circle</span>
                        {successMessage}
                    </div>
                )}

                <div className="veterinarians-header">
                    <div className="header-content">
                        <span className="material-symbols-outlined">medical_services</span>
                        <h1>Veterinários</h1>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    <div className="header-actions">
                        <select
                            className="filter-select"
                            value={filterEspecialidade}
                            onChange={(e) => setFilterEspecialidade(e.target.value)}
                        >
                            <option value="">Todas as Especialidades</option>
                            {especialidadesOptions.map(esp => (
                                <option key={esp} value={esp}>{esp}</option>
                            ))}
                        </select>

                        {canManage && (
                            <button className="add-vet-btn" onClick={handleOpenCreate}>
                                <span className="material-symbols-outlined">add</span>
                                Adicionar Veterinário
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="veterinarians-loading">
                        <span className="material-symbols-outlined spinning">progress_activity</span>
                        <p>Carregando veterinários...</p>
                    </div>
                ) : veterinarios.length === 0 ? (
                    <div className="empty-state">
                        <span className="material-symbols-outlined">medical_services</span>
                        <p>Nenhum veterinário encontrado</p>
                    </div>
                ) : (
                    <div className="veterinarians-grid">
                        {veterinarios.map(vet => (
                            <div key={vet.id} className="vet-card" onClick={() => openDetails(vet)}>
                                <div className="vet-header">
                                    <div className="vet-avatar">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div className="vet-info">
                                        <h3 className="vet-name">{vet.nome}</h3>
                                        <p className="vet-crmv">CRMV: {vet.crmv}</p>
                                    </div>
                                    {canManage && (
                                        <div className="vet-actions" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => handleEditClick(vet)}
                                                title="Editar"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(vet.id)}
                                                title="Excluir"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="vet-specialties">
                                    {Array.isArray(vet.especialidades) && vet.especialidades.map((esp, idx) => (
                                        <span key={idx} className="specialty-tag">{esp}</span>
                                    ))}
                                </div>

                                {vet.horarios_trabalho && Object.keys(vet.horarios_trabalho).length > 0 && (
                                    <div className="vet-schedule-preview">
                                        <span className="material-symbols-outlined">schedule</span>
                                        <span>Horários disponíveis</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{isEditing ? 'Editar Veterinário' : 'Novo Veterinário'}</h2>
                                <button className="close-btn" onClick={handleCloseModal}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <span className="material-symbols-outlined">error</span>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="vet-form">
                                <div className="form-group">
                                    <label htmlFor="nome">Nome Completo *</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Dr. João Silva"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="cpf">CPF *</label>
                                        <input
                                            type="text"
                                            id="cpf"
                                            name="cpf"
                                            value={formData.cpf}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="000.000.000-00"
                                            maxLength="14"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="crmv">CRMV *</label>
                                        <input
                                            type="text"
                                            id="crmv"
                                            name="crmv"
                                            value={formData.crmv}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="SP-12345"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="especialidades">Especialidades *</label>
                                    <input
                                        type="text"
                                        id="especialidades"
                                        name="especialidades"
                                        value={formData.especialidades}
                                        onChange={handleEspecialidadesChange}
                                        required
                                        placeholder="Clínica Geral, Cirurgia, Dermatologia"
                                    />
                                    <small>Separe as especialidades por vírgula</small>
                                </div>

                                <div className="form-group">
                                    <label>Horários de Trabalho</label>
                                    <div className="horarios-container">
                                        {diasSemana.map(({ key, label }) => (
                                            <div key={key} className="horario-dia">
                                                <div className="dia-header">
                                                    <span>{label}</span>
                                                    <button
                                                        type="button"
                                                        className="add-horario-btn"
                                                        onClick={() => addHorario(key)}
                                                    >
                                                        <span className="material-symbols-outlined">add</span>
                                                    </button>
                                                </div>
                                                <div className="horarios-list">
                                                    {horariosDia[key].map((horario, idx) => (
                                                        <div key={idx} className="horario-item">
                                                            <input
                                                                type="time"
                                                                value={horario.inicio}
                                                                onChange={(e) => updateHorario(key, idx, 'inicio', e.target.value)}
                                                                placeholder="Início"
                                                            />
                                                            <span>-</span>
                                                            <input
                                                                type="time"
                                                                value={horario.fim}
                                                                onChange={(e) => updateHorario(key, idx, 'fim', e.target.value)}
                                                                placeholder="Fim"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="remove-horario-btn"
                                                                onClick={() => removeHorario(key, idx)}
                                                            >
                                                                <span className="material-symbols-outlined">delete</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={handleCloseModal}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showDetails && vetDetails && (
                    <div className="modal-overlay" onClick={() => setShowDetails(false)}>
                        <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Detalhes do Veterinário</h2>
                                <button className="close-btn" onClick={() => setShowDetails(false)}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {detailsLoading ? (
                                <div className="details-loading">
                                    <span className="material-symbols-outlined spinning">progress_activity</span>
                                    <p>Carregando detalhes...</p>
                                </div>
                            ) : (
                                <div className="details-content">
                                    <div className="detail-section">
                                        <div className="detail-header">
                                            <div className="detail-avatar">
                                                <span className="material-symbols-outlined">person</span>
                                            </div>
                                            <div>
                                                <h3>{vetDetails.nome}</h3>
                                                <p className="detail-subtitle">CRMV: {vetDetails.crmv}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>
                                            <span className="material-symbols-outlined">badge</span>
                                            Informações Pessoais
                                        </h4>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <span className="label">CPF:</span>
                                                <span className="value">{vetDetails.cpf}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>
                                            <span className="material-symbols-outlined">star</span>
                                            Especialidades
                                        </h4>
                                        <div className="specialties-list">
                                            {Array.isArray(vetDetails.especialidades) && vetDetails.especialidades.map((esp, idx) => (
                                                <span key={idx} className="specialty-tag-large">{esp}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {vetDetails.horarios_trabalho && Object.keys(vetDetails.horarios_trabalho).length > 0 && (
                                        <div className="detail-section">
                                            <h4>
                                                <span className="material-symbols-outlined">schedule</span>
                                                Horários de Trabalho
                                            </h4>
                                            <div className="schedule-list">
                                                {Object.entries(vetDetails.horarios_trabalho).map(([dia, horarios]) => (
                                                    <div key={dia} className="schedule-item">
                                                        <span className="schedule-day">
                                                            {diasSemana.find(d => d.key === dia)?.label || dia}:
                                                        </span>
                                                        <span className="schedule-hours">
                                                            {Array.isArray(horarios) ? horarios.join(', ') : horarios}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
