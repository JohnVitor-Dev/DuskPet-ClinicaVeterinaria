import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterForm() {
    const [nome, setNome] = useState('');
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const nomeRef = useRef(null);
    const celularRef = useRef(null);
    const emailRef = useRef(null);
    const senhaRef = useRef(null);
    const confirmarSenhaRef = useRef(null);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleFocus = (ref) => {
        if (ref.current) {
            ref.current.focus({
                preventScroll: true
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!nome || !celular || !email || !senha || !confirmarSenha) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        if (senha.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email inválido');
            return;
        }

        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(celular)) {
            setError('Telefone inválido');
            return;
        }

        setLoading(true);

        try {
            const result = await register(nome, celular, email, senha);

            if (result.success) {
                navigate('/pets');
            } else {
                setError(result.error || 'Erro ao fazer cadastro');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor');
            console.error('Erro no registro:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="registerPage">
                <h2>Criar sua Conta</h2>
                <form className="registerForm" onSubmit={handleRegister}>
                    {error && (
                        <div style={{
                            color: '#ff4444',
                            backgroundColor: '#ffebee',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Nome Completo"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        ref={nomeRef}
                        onFocus={() => handleFocus(nomeRef)}
                        disabled={loading}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Celular (ex: (11) 98765-4321)"
                        value={celular}
                        onChange={e => setCelular(e.target.value)}
                        ref={celularRef}
                        onFocus={() => handleFocus(celularRef)}
                        disabled={loading}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        ref={emailRef}
                        onFocus={() => handleFocus(emailRef)}
                        disabled={loading}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha (mínimo 6 caracteres)"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        ref={senhaRef}
                        onFocus={() => handleFocus(senhaRef)}
                        disabled={loading}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirme sua Senha"
                        value={confirmarSenha}
                        onChange={e => setConfirmarSenha(e.target.value)}
                        ref={confirmarSenhaRef}
                        onFocus={() => handleFocus(confirmarSenhaRef)}
                        disabled={loading}
                        required
                    />
                    <button
                        className="button"
                        type="submit"
                        disabled={loading}
                        style={{
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                    <p className="login-link">Já possui uma conta? <a href="/login">Faça login</a></p>
                </form>
            </div>
        </>
    );
}