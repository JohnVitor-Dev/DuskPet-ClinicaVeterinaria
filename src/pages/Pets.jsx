import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PetService from "../services/PetService";

export default function Pets() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nome: "",
        especie: "",
        raca: "",
        sexo: "",
        data_nascimento: "",
        imagem: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        setLoading(true);
        const result = await PetService.listPets();
        if (result.success) {
            setPets(result.data);
        }
        setLoading(false);
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

        const submitData = {
            nome: formData.nome.trim(),
            especie: formData.especie.trim()
        };

        if (formData.raca && formData.raca.trim()) {
            submitData.raca = formData.raca.trim();
        }

        if (formData.sexo) {
            submitData.sexo = formData.sexo;
        }

        if (formData.data_nascimento) {
            submitData.data_nascimento = formData.data_nascimento;
        }

        console.log('Enviando dados:', submitData);

        const result = await PetService.createPet(submitData);
        if (result.success) {
            setShowModal(false);
            setFormData({
                nome: "",
                especie: "",
                raca: "",
                sexo: "",
                data_nascimento: "",
                imagem: null
            });
            setImagePreview(null);
            loadPets();
        } else {
            console.error('Erro ao criar pet:', result.error);
            console.error('Detalhes do erro:', result.details);
            if (result.details && result.details.length > 0) {
                console.error('Primeiro detalhe:', result.details[0]);
                console.error('Todos os detalhes:', JSON.stringify(result.details, null, 2));
            }
            const detailsMsg = result.details && result.details.length > 0
                ? '\n' + result.details.map(d => d.message || d).join('\n')
                : '';
            alert('Erro ao adicionar pet: ' + (result.error || 'Erro desconhecido') + detailsMsg);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja remover este pet?")) {
            const result = await PetService.deletePet(id);
            if (result.success) {
                loadPets();
            }
        }
    };

    return (
        <>
            <NavBar />
            <div className="page-wrapper">
                <main className="pets-container">

                    {loading ? (
                        <div className="pets-loading">
                            <span className="material-symbols-outlined spinning">.</span>
                            <p>Carregando...</p>
                        </div>
                    ) : pets.length > 0 ? (
                        <div className="pets-grid">
                            {pets.map((pet) => (
                                <div key={pet.id} className="pet-card">
                                    <div className="pet-card-content">
                                        <div className="pet-avatar">
                                            {pet.imagem_url ? (
                                                <img src={pet.imagem_url} alt={pet.nome} />
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
                                                    Nascimento: {new Date(pet.data_nascimento).toLocaleDateString('pt-BR')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="pet-actions">
                                            <button
                                                className="pet-action-btn delete"
                                                onClick={() => handleDelete(pet.id)}
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
                        onClick={() => setShowModal(true)}
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span>Adicionar Pet</span>
                    </button>

                    {showModal && (
                        <div className="modal-overlay" onClick={() => setShowModal(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Adicionar Novo Pet</h2>
                                    <button
                                        className="modal-close"
                                        onClick={() => setShowModal(false)}
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
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            Adicionar Pet
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
