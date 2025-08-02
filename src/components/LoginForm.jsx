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
            <form className="loginForm" onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
                <a href="/forgot-password">Esqueceu a senha?</a>
                <button className="button" type="submit">Entrar</button>
            </form>
            {/* Social Media */}
        </>
    );
}