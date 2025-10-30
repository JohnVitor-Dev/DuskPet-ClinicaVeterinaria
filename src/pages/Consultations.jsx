import { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import AgendamentoService from '../services/AgendamentoService';
import PetService from '../services/PetService';
import VeterinarioService from '../services/VeterinarioService';
import '../styles/components/Consultations.css';

export default function Consultations() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [pets, setPets] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAgendamento, setSelectedAgendamento] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        pet_id: "",
        veterinario_id: "",
        data_hora: "",
        tipo_consulta: "",
        status: ""
    });
    const [filterStatus, setFilterStatus] = useState("");
    const [filterPet, setFilterPet] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [agendamentoDetails, setAgendamentoDetails] = useState(null);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [checkingHorarios, setCheckingHorarios] = useState(false);
    const [error, setError] = useState(null);
    const [filterLoading, setFilterLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        await Promise.all([
            loadAgendamentos(),
            loadPets(),
            loadVeterinarios()
        ]);
        setLoading(false);
    };

    const loadAgendamentos = async () => {
        try {
            setError(null);
            const params = {};
            if (filterStatus) params.status = filterStatus;
            if (filterPet) params.pet_id = filterPet;

            const result = await AgendamentoService.listAgendamentos(Object.keys(params).length > 0 ? params : undefined);
            if (result.success) {
                setAgendamentos(result.data);
            } else {
                console.error('Erro ao carregar agendamentos:', result.error);
                setError('Erro ao carregar agendamentos. Tente novamente.');
            }
        } catch (err) {
            console.error('Erro inesperado:', err);
            setError('Erro inesperado ao carregar agendamentos.');
        }
    };

    const loadPets = async () => {
        const result = await PetService.listPets();
        if (result.success) {
            setPets(result.data);
        }
    };

    const loadVeterinarios = async () => {
        const result = await VeterinarioService.listVeterinarios();
        if (result.success) {
            setVeterinarios(result.data);
        }
    };

    useEffect(() => {
        if (!loading) {
            setFilterLoading(true);
            loadAgendamentos().finally(() => setFilterLoading(false));
        }
    }, [filterStatus, filterPet]);

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toDateTimeInputValue = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const getMinDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            'Agendado': '#3b82f6',
            'Confirmado': '#10b981',
            'Conclu_do': '#6b7280',
            'Cancelado': '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'Agendado': 'Agendado',
            'Confirmado': 'Confirmado',
            'Conclu_do': 'Concluído',
            'Cancelado': 'Cancelado'
        };
        return labels[status] || status;
    };

    const getPetName = (petId) => {
        const pet = pets.find(p => p.id === petId);
        return pet ? pet.nome : 'Pet não encontrado';
    };

    const getVetName = (vetId) => {
        const vet = veterinarios.find(v => v.id === vetId);
        return vet ? vet.nome : 'Veterinário não encontrado';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'veterinario_id' || name === 'data_hora') {
            checkHorariosDisponiveis(
                name === 'veterinario_id' ? value : formData.veterinario_id,
                name === 'data_hora' ? value : formData.data_hora
            );
        }
    };

    const checkHorariosDisponiveis = async (vetId, dataHora) => {
        if (!vetId || !dataHora) return;

        setCheckingHorarios(true);
        const date = new Date(dataHora);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        const result = await AgendamentoService.getHorariosDisponiveis({
            veterinario_id: vetId,
            data: dateStr
        });

        if (result.success) {
            setHorariosDisponiveis(result.data);
        }
        setCheckingHorarios(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const submitData = {
                pet_id: parseInt(formData.pet_id),
                veterinario_id: parseInt(formData.veterinario_id),
                data_hora: new Date(formData.data_hora).toISOString(),
                tipo_consulta: formData.tipo_consulta || undefined
            };

            if (isEditing && formData.status) {
                submitData.status = formData.status;
            }

            const result = isEditing && selectedAgendamento
                ? await AgendamentoService.updateAgendamento(selectedAgendamento.id, submitData)
                : await AgendamentoService.createAgendamento(submitData);

            if (result.success) {
                setSuccessMessage(isEditing ? 'Agendamento atualizado com sucesso!' : 'Agendamento criado com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
                handleCloseModal();
                await loadAgendamentos();
            } else {
                setError(`Erro ao ${isEditing ? 'atualizar' : 'criar'} agendamento: ${result.error}`);
            }
        } catch (err) {
            setError(`Erro inesperado: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;

        setError(null);
        const result = await AgendamentoService.cancelAgendamento(id);
        if (result.success) {
            setSuccessMessage('Agendamento cancelado com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
            await loadAgendamentos();
        } else {
            setError('Erro ao cancelar agendamento: ' + result.error);
        }
    };

    const handleEditClick = (agendamento) => {
        setIsEditing(true);
        setSelectedAgendamento(agendamento);
        setFormData({
            pet_id: agendamento.pet_id?.toString() || "",
            veterinario_id: agendamento.veterinario_id?.toString() || "",
            data_hora: toDateTimeInputValue(agendamento.data_hora),
            tipo_consulta: agendamento.tipo_consulta || "",
            status: agendamento.status || ""
        });
        setShowModal(true);
    };

    const handleOpenCreate = () => {
        setIsEditing(false);
        setSelectedAgendamento(null);
        setFormData({
            pet_id: "",
            veterinario_id: "",
            data_hora: "",
            tipo_consulta: "",
            status: ""
        });
        setHorariosDisponiveis([]);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedAgendamento(null);
        setFormData({
            pet_id: "",
            veterinario_id: "",
            data_hora: "",
            tipo_consulta: "",
            status: ""
        });
        setHorariosDisponiveis([]);
        setIsSubmitting(false);
        setError(null);
    };

    const openDetails = async (agendamento) => {
        setShowDetails(true);
        setDetailsLoading(true);
        setAgendamentoDetails(null);
        setError(null);

        const result = await AgendamentoService.getAgendamento(agendamento.id);
        if (result.success) {
            setAgendamentoDetails(result.data);
        } else {
            setError('Não foi possível carregar os detalhes do agendamento.');
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
            <div className="page-wrapper">
                <main className="consultations-container page-bg-pattern">
                    <div className="consultations-header">
                        <div className="header-content">
                            <span className="material-symbols-outlined">calendar_month</span>
                            <h1>Consultas</h1>
                        </div>
                        <div className="header-filters">
                            <select
                                className="filter-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Todos os Status</option>
                                <option value="Agendado">Agendado</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Conclu_do">Concluído</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                            <select
                                className="filter-select"
                                value={filterPet}
                                onChange={(e) => setFilterPet(e.target.value)}
                            >
                                <option value="">Todos os Pets</option>
                                {pets.map(pet => (
                                    <option key={pet.id} value={pet.id}>
                                        {pet.nome}
                                    </option>
                                ))}
                            </select>
                            {(filterStatus || filterPet) && (
                                <button
                                    className="clear-filters-btn"
                                    onClick={() => {
                                        setFilterStatus("");
                                        setFilterPet("");
                                    }}
                                    title="Limpar filtros"
                                >
                                    <span className="material-symbols-outlined">filter_alt_off</span>
                                    <span>Limpar</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="material-symbols-outlined">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="consultations-loading">
                            <span className="material-symbols-outlined spinning">autorenew</span>
                            <p>Carregando...</p>
                        </div>
                    ) : filterLoading ? (
                        <div className="consultations-loading">
                            <span className="material-symbols-outlined spinning">filter_alt</span>
                            <p>Aplicando filtros...</p>
                        </div>
                    ) : agendamentos.length > 0 ? (
                        <div className="consultations-grid">
                            {agendamentos.map((agendamento) => (
                                <div
                                    key={agendamento.id}
                                    className="consultation-card"
                                    onClick={() => openDetails(agendamento)}
                                >
                                    <div className="consultation-header-card">
                                        <span
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(agendamento.status) }}
                                        >
                                            {getStatusLabel(agendamento.status)}
                                        </span>
                                        <span className="consultation-date">
                                            {formatDateTime(agendamento.data_hora)}
                                        </span>
                                    </div>

                                    <div className="consultation-info">
                                        <div className="info-row">
                                            <span className="material-symbols-outlined">pets</span>
                                            <span>{getPetName(agendamento.pet_id)}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="material-symbols-outlined">medical_services</span>
                                            <span>{getVetName(agendamento.veterinario_id)}</span>
                                        </div>
                                        {agendamento.tipo_consulta && (
                                            <div className="info-row">
                                                <span className="material-symbols-outlined">description</span>
                                                <span>{agendamento.tipo_consulta}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="consultation-actions">
                                        <button
                                            className="action-btn edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(agendamento);
                                            }}
                                            title="Editar agendamento"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        {agendamento.status !== 'Cancelado' && agendamento.status !== 'Conclu_do' && (
                                            <button
                                                className="action-btn cancel"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCancel(agendamento.id);
                                                }}
                                                title="Cancelar agendamento"
                                            >
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="consultations-empty">
                            <span className="material-symbols-outlined">event_busy</span>
                            <h2>Nenhuma Consulta Encontrada</h2>
                            <p>
                                {pets.length === 0
                                    ? 'Você precisa cadastrar um pet antes de agendar uma consulta.'
                                    : filterStatus || filterPet
                                        ? 'Tente ajustar os filtros para ver outros agendamentos.'
                                        : 'Clique em "Agendar Consulta" para criar um novo agendamento.'}
                            </p>
                        </div>
                    )}

                    <button className="add-button" onClick={handleOpenCreate} disabled={pets.length === 0}>
                        <span className="material-symbols-outlined">add</span>
                        <span>Agendar Consulta</span>
                    </button>

                    {showModal && (
                        <div className="modal-overlay" onClick={handleCloseModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>{isEditing ? 'Editar Agendamento' : 'Nova Consulta'}</h2>
                                    <button className="modal-close" onClick={handleCloseModal}>
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <form className="consultation-form" onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="error-message">
                                            <span className="material-symbols-outlined">error</span>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="pet_id">Pet *</label>
                                        <select
                                            id="pet_id"
                                            name="pet_id"
                                            value={formData.pet_id}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isEditing}
                                        >
                                            <option value="">Selecione um pet</option>
                                            {pets.map(pet => (
                                                <option key={pet.id} value={pet.id}>
                                                    {pet.nome} ({pet.especie})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="veterinario_id">Veterinário *</label>
                                        <select
                                            id="veterinario_id"
                                            name="veterinario_id"
                                            value={formData.veterinario_id}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Selecione um veterinário</option>
                                            {veterinarios.map(vet => (
                                                <option key={vet.id} value={vet.id}>
                                                    {vet.nome} {vet.especialidades ? `- ${vet.especialidades.join(', ')}` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="data_hora">Data e Hora *</label>
                                        <input
                                            type="datetime-local"
                                            id="data_hora"
                                            name="data_hora"
                                            value={formData.data_hora}
                                            onChange={handleInputChange}
                                            min={!isEditing ? getMinDateTime() : undefined}
                                            required
                                        />
                                        {checkingHorarios && (
                                            <small className="form-info checking">Verificando disponibilidade...</small>
                                        )}
                                        {horariosDisponiveis.length > 0 && !checkingHorarios && (
                                            <small className="form-info available">
                                                ✓ {horariosDisponiveis.length} horário(s) disponível(is) neste dia
                                            </small>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="tipo_consulta">Tipo de Consulta</label>
                                        <input
                                            type="text"
                                            id="tipo_consulta"
                                            name="tipo_consulta"
                                            value={formData.tipo_consulta}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Consulta de rotina, Vacina, Emergência..."
                                        />
                                    </div>

                                    {isEditing && (
                                        <div className="form-group">
                                            <label htmlFor="status">Status</label>
                                            <select
                                                id="status"
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Agendado">Agendado</option>
                                                <option value="Confirmado">Confirmado</option>
                                                <option value="Conclu_do">Concluído</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={handleCloseModal}
                                            disabled={isSubmitting}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Agendar')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showDetails && (
                        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
                            <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Detalhes do Agendamento</h2>
                                    <button className="modal-close" onClick={() => setShowDetails(false)}>
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="modal-body">
                                    {detailsLoading ? (
                                        <div className="details-loading">
                                            <span className="material-symbols-outlined spinning">autorenew</span>
                                            <p>Carregando...</p>
                                        </div>
                                    ) : agendamentoDetails ? (
                                        <div className="details-content">
                                            <div className="detail-group">
                                                <span className="detail-label">Status:</span>
                                                <div>
                                                    <span
                                                        className="status-badge"
                                                        style={{ backgroundColor: getStatusColor(agendamentoDetails.status) }}
                                                    >
                                                        {getStatusLabel(agendamentoDetails.status)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="detail-group">
                                                <span className="detail-label">Data e Hora:</span>
                                                <span>{formatDateTime(agendamentoDetails.data_hora)}</span>
                                            </div>

                                            <div className="detail-group">
                                                <span className="detail-label">Pet:</span>
                                                <span>{getPetName(agendamentoDetails.pet_id)}</span>
                                            </div>

                                            <div className="detail-group">
                                                <span className="detail-label">Veterinário:</span>
                                                <span>{getVetName(agendamentoDetails.veterinario_id)}</span>
                                            </div>

                                            {agendamentoDetails.tipo_consulta && (
                                                <div className="detail-group">
                                                    <span className="detail-label">Tipo de Consulta:</span>
                                                    <span>{agendamentoDetails.tipo_consulta}</span>
                                                </div>
                                            )}

                                            <div className="detail-group">
                                                <span className="detail-label">Criado em:</span>
                                                <span>{formatDateTime(agendamentoDetails.created_at)}</span>
                                            </div>

                                            {agendamentoDetails.updated_at && (
                                                <div className="detail-group">
                                                    <span className="detail-label">Atualizado em:</span>
                                                    <span>{formatDateTime(agendamentoDetails.updated_at)}</span>
                                                </div>
                                            )}

                                            <div className="details-actions">
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => {
                                                        setShowDetails(false);
                                                        handleEditClick(agendamentoDetails);
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined">edit</span>
                                                    Editar
                                                </button>
                                                {agendamentoDetails.status !== 'Cancelado' && agendamentoDetails.status !== 'Conclu_do' && (
                                                    <button
                                                        className="btn-danger"
                                                        onClick={() => {
                                                            setShowDetails(false);
                                                            handleCancel(agendamentoDetails.id);
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined">close</span>
                                                        Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p>Erro ao carregar detalhes.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {successMessage && (
                <div className="success-toast">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>{successMessage}</span>
                </div>
            )}
        </>
    );
}
