import { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import PetService from "../services/PetService";
import AgendamentoService from "../services/AgendamentoService";
import HistoricoService from "../services/HistoricoService";

export default function Pets() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [petDetails, setPetDetails] = useState(null);
    const [formData, setFormData] = useState({
        nome: "",
        especie: "",
        raca: "",
        sexo: "",
        data_nascimento: "",
        imagem: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [historicos, setHistoricos] = useState([]);
    const [historicosLoading, setHistoricosLoading] = useState(false);
    const [showHistoricoModal, setShowHistoricoModal] = useState(false);
    const [historicoSubmitting, setHistoricoSubmitting] = useState(false);
    const [historicoForm, setHistoricoForm] = useState({
        vacinas: "",
        doencas_alergias: "",
        medicamentos: "",
        observacoes: "",
        agendamento_id: "",
    });
    const [agendamentosPet, setAgendamentosPet] = useState([]);
    const [agendamentosLoading, setAgendamentosLoading] = useState(false);
    const [petImageUrls, setPetImageUrls] = useState({}); // id -> base64 ou URL
    const [fetchingImages, setFetchingImages] = useState({}); // id -> boolean
    const fetchQueueRef = useRef(new Set());
    const debounceTimerRef = useRef(null);
    const DEBOUNCE_MS = 300;

    const formatDateBR = (dateStr) => {
        if (!dateStr) return '';
        const iso = String(dateStr).slice(0, 10);
        if (!/\d{4}-\d{2}-\d{2}/.test(iso)) return dateStr;
        const [y, m, d] = iso.split('-');
        return `${d}/${m}/${y}`;
    };

    const toDateInputValue = (dateStr) => {
        return dateStr ? String(dateStr).slice(0, 10) : '';
    };

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!pets || pets.length === 0) return;
        const validIds = new Set(pets.map((p) => String(p.id)));
        setPetImageUrls((prev) => {
            const next = {};
            for (const [id, url] of Object.entries(prev)) {
                if (validIds.has(String(id))) {
                    next[id] = url;
                }
            }
            return next;
        });
    }, [pets]);

    useEffect(() => {
        loadPets(false);
    }, []);

    const [usingCache, setUsingCache] = useState(false);
    const [lastFetchError, setLastFetchError] = useState(null);
    const [cacheInfo, setCacheInfo] = useState(null);

    const loadPets = async (forceRefresh = false) => {
        setLastFetchError(null);
        setUsingCache(false);
        setCacheInfo(null);
        setLoading(true);

        try {
            const result = await PetService.listPets(forceRefresh);

            if (result.success) {
                setPets(result.data);
                setUsingCache(result.fromCache);

                if (result.fromCache) {
                    setCacheInfo({
                        cachedAt: result.cachedAt,
                        isStale: result.isStale
                    });
                    console.log('📦 Pets carregados do cache local');
                } else {
                    console.log('🌐 Pets carregados do servidor');
                }

                result.data.forEach(p => {
                    if (!p.imagem_url) {
                        scheduleFetchPetImage(p.id);
                    }
                });
            } else {
                setLastFetchError({ message: result.error });
                setPets([]);
            }
        } catch (error) {
            console.error('Erro ao carregar pets:', error);
            setLastFetchError({ message: error.message });
            setPets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imagem: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const hasImage = formData.imagem instanceof File;
        let submitData;
        if (hasImage) {
            const fd = new FormData();
            fd.append('nome', formData.nome.trim());
            fd.append('especie', formData.especie.trim());
            if (formData.raca && formData.raca.trim()) fd.append('raca', formData.raca.trim());
            if (formData.sexo) fd.append('sexo', formData.sexo);
            if (formData.data_nascimento) fd.append('data_nascimento', formData.data_nascimento);
            fd.append('imagem', formData.imagem);
            submitData = fd;
        } else {
            submitData = {
                nome: formData.nome.trim(),
                especie: formData.especie.trim(),
                ...(formData.raca && formData.raca.trim() ? { raca: formData.raca.trim() } : {}),
                ...(formData.sexo ? { sexo: formData.sexo } : {}),
                ...(formData.data_nascimento ? { data_nascimento: formData.data_nascimento } : {}),
            };
        }

        const result = isEditing && selectedPet
            ? await PetService.updatePet(selectedPet.id, submitData)
            : await PetService.createPet(submitData);

        if (result.success) {
            handleCloseModal();
            await loadPets(false);
        } else {
            console.error(isEditing ? 'Erro ao atualizar pet:' : 'Erro ao criar pet:', result.error);
            console.error('Detalhes do erro:', result.details);
            const detailsMsg = result.details && result.details.length > 0
                ? '\n' + result.details.map(d => d.message || d).join('\n')
                : '';
            alert((isEditing ? 'Erro ao atualizar pet: ' : 'Erro ao adicionar pet: ') + (result.error || 'Erro desconhecido') + detailsMsg);
        }

        setIsSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja remover este pet?")) {
            const result = await PetService.deletePet(id);
            if (result.success) {
                loadPets(false);
            }
        }
    };

    const handleEditClick = (pet) => {
        setIsEditing(true);
        setSelectedPet(pet);
        setFormData({
            nome: pet.nome || '',
            especie: pet.especie || '',
            raca: pet.raca || '',
            sexo: pet.sexo || '',
            data_nascimento: toDateInputValue(pet.data_nascimento),
            imagem: null
        });
        setImagePreview(pet.imagem_url || null);
        setShowModal(true);
    };

    const handleOpenCreate = () => {
        setIsEditing(false);
        setSelectedPet(null);
        setFormData({
            nome: "",
            especie: "",
            raca: "",
            sexo: "",
            data_nascimento: "",
            imagem: null
        });
        setImagePreview(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedPet(null);
        setFormData({
            nome: "",
            especie: "",
            raca: "",
            sexo: "",
            data_nascimento: "",
            imagem: null
        });
        setImagePreview(null);
        setIsSubmitting(false);
    };

    const openDetails = async (pet) => {
        setShowDetails(true);
        setDetailsLoading(true);
        setPetDetails(null);
        const result = await PetService.getPet(pet.id);
        if (result.success) {
            setPetDetails(result.data);
            loadHistoricos(pet.id);
            loadAgendamentosPet(pet.id);
            if (!pet.imagem_url && !petImageUrls[pet.id]) {
                fetchPetImage(pet.id);
            }
        } else {
            alert('Não foi possível carregar os detalhes do pet.');
            setShowDetails(false);
        }
        setDetailsLoading(false);
    };

    const fetchPetImage = async (id) => {
        if (fetchingImages[id] || petImageUrls[id]) return;
        setFetchingImages(prev => ({ ...prev, [id]: true }));
        const res = await PetService.fetchPetImageObjectUrl(id);
        if (res.success) {
            setPetImageUrls(prev => ({ ...prev, [id]: res.data }));
        }
        setFetchingImages(prev => ({ ...prev, [id]: false }));
    };

    const processFetchQueue = () => {
        const ids = Array.from(fetchQueueRef.current);
        fetchQueueRef.current.clear();
        ids.forEach((id) => fetchPetImage(id));
    };

    const scheduleFetchPetImage = (id) => {
        fetchQueueRef.current.add(id);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            debounceTimerRef.current = null;
            processFetchQueue();
        }, DEBOUNCE_MS);
    };

    const loadHistoricos = async (petId) => {
        setHistoricosLoading(true);
        const res = await HistoricoService.listByPet(petId);
        if (res.success) setHistoricos(res.data);
        setHistoricosLoading(false);
    };

    const loadAgendamentosPet = async (petId) => {
        setAgendamentosLoading(true);
        const res = await AgendamentoService.listAgendamentos({ pet_id: petId });
        if (res.success) setAgendamentosPet(res.data);
        setAgendamentosLoading(false);
    };

    const handleHistoricoInput = (e) => {
        const { name, value } = e.target;
        setHistoricoForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateHistorico = async (e) => {
        e.preventDefault();
        if (!selectedPet?.id) return;
        setHistoricoSubmitting(true);
        const payload = {
            pet_id: selectedPet.id,
            ...(historicoForm.agendamento_id ? { agendamento_id: parseInt(historicoForm.agendamento_id, 10) } : {}),
            ...(historicoForm.vacinas ? { vacinas: historicoForm.vacinas } : {}),
            ...(historicoForm.doencas_alergias ? { doencas_alergias: historicoForm.doencas_alergias } : {}),
            ...(historicoForm.medicamentos ? { medicamentos: historicoForm.medicamentos } : {}),
            ...(historicoForm.observacoes ? { observacoes: historicoForm.observacoes } : {}),
        };
        const res = await HistoricoService.createHistorico(payload);
        if (res.success) {
            setShowHistoricoModal(false);
            setHistoricoForm({ vacinas: "", doencas_alergias: "", medicamentos: "", observacoes: "", agendamento_id: "" });
            await loadHistoricos(selectedPet.id);
        } else {
            const detailsMsg = res.details && res.details.length > 0 ? '\n' + res.details.map(d => d.message || d).join('\n') : '';
            alert('Erro ao criar histórico: ' + (res.error || 'Erro desconhecido') + detailsMsg);
        }
        setHistoricoSubmitting(false);
    };

    return (
        <>
            <NavBar />
            <div className="page-wrapper">
                <main className="pets-container page-bg-pattern">

                    {(usingCache || cacheInfo) && !loading && (
                        <div className="cache-status-bar">
                            <span className="material-symbols-outlined">storage</span>
                            <span>
                                Dados do cache local
                                {cacheInfo?.cachedAt && ` (${cacheInfo.cachedAt})`}
                                {cacheInfo?.isStale && ' - Dados podem estar desatualizados'}
                            </span>
                            <button
                                className="refresh-button"
                                onClick={() => loadPets(true)}
                                title="Atualizar do servidor"
                            >
                                <span className="material-symbols-outlined">refresh</span>
                                Atualizar
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="pets-loading">
                            <span className="material-symbols-outlined spinning">autorenew</span>
                            <p>Carregando...</p>
                        </div>
                    ) : pets.length > 0 ? (
                        <div className="pets-grid">
                            {pets.map((pet) => (
                                <div key={pet.id} className="pet-card" onClick={() => openDetails(pet)}>
                                    <div className="pet-card-content">
                                        <div className="pet-avatar">
                                            {pet.imagem_url ? (
                                                <img src={pet.imagem_url} alt={pet.nome} />
                                            ) : petImageUrls[pet.id] ? (
                                                <img src={petImageUrls[pet.id]} alt={pet.nome} />
                                            ) : (
                                                <span className="material-symbols-outlined">pets</span>
                                            )}
                                        </div>
                                        <div className="pet-info">
                                            <p className="pet-name">{pet.nome}</p>
                                            <p className="pet-detail">Espécie: {pet.especie}</p>
                                            {pet.raca && <p className="pet-detail">Raça: {pet.raca}</p>}
                                            {pet.sexo && <p className="pet-detail">Sexo: {pet.sexo}</p>}
                                            {pet.data_nascimento && (
                                                <p className="pet-detail">
                                                    Nascimento: {formatDateBR(pet.data_nascimento)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="pet-actions">
                                            <button
                                                className="pet-action-btn"
                                                onClick={(e) => { e.stopPropagation(); handleEditClick(pet); }}
                                                title="Editar pet"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button
                                                className="pet-action-btn delete"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(pet.id); }}
                                                title="Remover pet"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="pets-empty-state">
                            <span className="material-symbols-outlined">pets</span>
                            <h2>Nenhum Animal Cadastrado</h2>
                            <p>
                                Clique em <span className="highlight">'+ Adicionar Pet'</span> para registrar seu primeiro companheiro.
                            </p>
                        </div>
                    )}

                    <button
                        className="pets-add-button"
                        onClick={handleOpenCreate}
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span>{isEditing ? 'Editar Pet' : 'Adicionar Pet'}</span>
                    </button>

                    {showModal && (
                        <div className="modal-overlay" onClick={() => setShowModal(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>{isEditing ? 'Editar Pet' : 'Adicionar Novo Pet'}</h2>
                                    <button
                                        className="modal-close"
                                        onClick={handleCloseModal}
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="pet-form">
                                    <div className="form-group">
                                        <label htmlFor="imagem">Foto do Pet</label>
                                        <div className="image-upload-container">
                                            {imagePreview ? (
                                                <div className="image-preview">
                                                    <img src={imagePreview} alt="Preview" />
                                                    <button
                                                        type="button"
                                                        className="remove-image"
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            setFormData(prev => ({ ...prev, imagem: null }));
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined">close</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <label htmlFor="imagem" className="image-upload-label">
                                                    <span className="material-symbols-outlined">add_photo_alternate</span>
                                                    <span>Adicionar foto</span>
                                                </label>
                                            )}
                                            <input
                                                type="file"
                                                id="imagem"
                                                name="imagem"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nome">Nome *</label>
                                        <input
                                            type="text"
                                            id="nome"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="especie">Espécie *</label>
                                        <input
                                            type="text"
                                            id="especie"
                                            name="especie"
                                            value={formData.especie}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="raca">Raça</label>
                                        <input
                                            type="text"
                                            id="raca"
                                            name="raca"
                                            value={formData.raca}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="sexo">Sexo</label>
                                            <select
                                                id="sexo"
                                                name="sexo"
                                                value={formData.sexo}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Selecione</option>
                                                <option value="Macho">Macho</option>
                                                <option value="Fêmea">Fêmea</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="data_nascimento">Data de Nascimento</label>
                                            <input
                                                type="date"
                                                id="data_nascimento"
                                                name="data_nascimento"
                                                value={formData.data_nascimento}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={handleCloseModal}
                                        >
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                            {isSubmitting ? (isEditing ? 'Salvando...' : 'Adicionando...') : (isEditing ? 'Salvar Alterações' : 'Adicionar Pet')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {showDetails && (
                        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Detalhes do Pet</h2>
                                    <button
                                        className="modal-close"
                                        onClick={() => setShowDetails(false)}
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="pet-form">
                                    {detailsLoading ? (
                                        <div className="pets-loading">
                                            <span className="material-symbols-outlined spinning">autorenew</span>
                                            <p>Carregando...</p>
                                        </div>
                                    ) : petDetails ? (
                                        <>
                                            <div className="image-preview" style={{ maxWidth: '200px' }}>
                                                {petDetails.imagem_url ? (
                                                    <img src={petDetails.imagem_url} alt={petDetails.nome} />
                                                ) : petImageUrls[petDetails.id] ? (
                                                    <img src={petImageUrls[petDetails.id]} alt={petDetails.nome} />
                                                ) : (
                                                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                                                        <span className="material-symbols-outlined">pets</span>
                                                    </div>
                                                )}
                                            </div>
                                            <hr style={{ borderColor: 'var(--border-color)', opacity: 0.4 }} />
                                            <h3 style={{ color: 'var(--text-primary)', marginTop: '0.5rem' }}>Histórico Clínico</h3>
                                            {historicosLoading ? (
                                                <p style={{ color: 'var(--text-secondary)' }}>Carregando histórico...</p>
                                            ) : historicos && historicos.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {historicos.map((h) => (
                                                        <div key={h.id} style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                                                            {h.vacinas && <p className="pet-detail">Vacinas: {h.vacinas}</p>}
                                                            {h.doencas_alergias && <p className="pet-detail">Doenças/Alergias: {h.doencas_alergias}</p>}
                                                            {h.medicamentos && <p className="pet-detail">Medicamentos: {h.medicamentos}</p>}
                                                            {h.observacoes && <p className="pet-detail">Observações: {h.observacoes}</p>}
                                                            {h.created_at && <p className="pet-detail">Criado em: {new Date(h.created_at).toLocaleString('pt-BR')}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ color: 'var(--text-secondary)' }}>Nenhum histórico cadastrado para este pet.</p>
                                            )}
                                            <div className="form-actions" style={{ marginTop: '1rem' }}>
                                                <button type="button" className="btn-primary" onClick={() => { setShowHistoricoModal(true); setSelectedPet(petDetails); }}>
                                                    Adicionar Histórico
                                                </button>
                                            </div>
                                            <hr style={{ borderColor: 'var(--border-color)', opacity: 0.4 }} />
                                            <h3 style={{ color: 'var(--text-primary)', marginTop: '0.5rem' }}>Agendamentos</h3>
                                            {agendamentosLoading ? (
                                                <p style={{ color: 'var(--text-secondary)' }}>Carregando agendamentos...</p>
                                            ) : agendamentosPet && agendamentosPet.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {agendamentosPet.map((a) => (
                                                        <div key={a.id} style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                                                            <p className="pet-detail">Data/Hora: {a.data_hora ? new Date(a.data_hora).toLocaleString('pt-BR') : '-'}</p>
                                                            {a.tipo_consulta && <p className="pet-detail">Tipo: {a.tipo_consulta}</p>}
                                                            {a.status && <p className="pet-detail">Status: {a.status}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ color: 'var(--text-secondary)' }}>Nenhum agendamento encontrado para este pet.</p>
                                            )}
                                            <div className="form-group">
                                                <label>Nome</label>
                                                <input value={petDetails.nome} readOnly />
                                            </div>
                                            <div className="form-group">
                                                <label>Espécie</label>
                                                <input value={petDetails.especie} readOnly />
                                            </div>
                                            {petDetails.raca && (
                                                <div className="form-group">
                                                    <label>Raça</label>
                                                    <input value={petDetails.raca} readOnly />
                                                </div>
                                            )}
                                            {petDetails.sexo && (
                                                <div className="form-group">
                                                    <label>Sexo</label>
                                                    <input value={petDetails.sexo} readOnly />
                                                </div>
                                            )}
                                            {petDetails.data_nascimento && (
                                                <div className="form-group">
                                                    <label>Data de Nascimento</label>
                                                    <input value={formatDateBR(petDetails.data_nascimento)} readOnly />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p style={{ color: 'var(--text-secondary)' }}>
                                            Não há detalhes disponíveis.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {showHistoricoModal && (
                        <div className="modal-overlay" onClick={() => setShowHistoricoModal(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Novo Histórico</h2>
                                    <button
                                        className="modal-close"
                                        onClick={() => setShowHistoricoModal(false)}
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <form className="pet-form" onSubmit={handleCreateHistorico}>
                                    <div className="form-group">
                                        <label htmlFor="agendamento_id">Agendamento (opcional)</label>
                                        <select id="agendamento_id" name="agendamento_id" value={historicoForm.agendamento_id} onChange={handleHistoricoInput}>
                                            <option value="">Selecione</option>
                                            {agendamentosPet.map(a => (
                                                <option key={a.id} value={a.id}>
                                                    #{a.id} - {a.data_hora ? new Date(a.data_hora).toLocaleString('pt-BR') : 'Sem data'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="vacinas">Vacinas</label>
                                        <input id="vacinas" name="vacinas" value={historicoForm.vacinas} onChange={handleHistoricoInput} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="doencas_alergias">Doenças/Alergias</label>
                                        <input id="doencas_alergias" name="doencas_alergias" value={historicoForm.doencas_alergias} onChange={handleHistoricoInput} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="medicamentos">Medicamentos</label>
                                        <input id="medicamentos" name="medicamentos" value={historicoForm.medicamentos} onChange={handleHistoricoInput} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="observacoes">Observações</label>
                                        <input id="observacoes" name="observacoes" value={historicoForm.observacoes} onChange={handleHistoricoInput} />
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="btn-secondary" onClick={() => setShowHistoricoModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn-primary" disabled={historicoSubmitting}>
                                            {historicoSubmitting ? 'Salvando...' : 'Salvar Histórico'}
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
