import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !senha) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, senha);

            if (result.success) {
                navigate('/pets');
            } else {
                setError(result.error || 'Erro ao fazer login');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor');
            console.error('Erro no login:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="loginPage">
                <h2>Login</h2>
                <form className="loginForm" onSubmit={handleLogin}>
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
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <div className="forgot-password-link">
                        <a className="" href="/forgot-password">Esqueceu a senha?</a>
                    </div>
                    <button
                        className="button"
                        type="submit"
                        disabled={loading}
                        style={{
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                    <p>Ainda não possui uma conta? <a href="/register">Cadastre-se</a></p>
                </form>
            </div>
        </>
    );
}