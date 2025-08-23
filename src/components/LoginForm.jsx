import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log(email, senha);
        // backend
    };

    return (
        <>
            <div className="loginPage">
                <h2>Login</h2>
                <form className="loginForm" onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
                    <div className="forgot-password-link"><a className="" href="/forgot-password">Esqueceu a senha?</a></div>
                    <button className="button" type="submit">Entrar</button>
                    <p>Ainda não possui uma conta? <a href="/register">Cadastre-se</a></p>
                    <a href="/pets">Usar Conta de Demostração</a>

                </form>
            </div>
            {/* Social Media */}
        </>
    );
}