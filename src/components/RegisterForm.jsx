import { useState } from "react";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        console.log(email, senha);
        // backend
    };

    return (
        <>
            <div className="registerPage">
                <h2>Registrar</h2>
                <form className="registerForm" onSubmit={handleRegister}>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
                    <button className="button" type="submit">Registrar</button>
                    <p>Já possui uma conta? <a href="/login">Faça login</a></p>
                </form>
            </div>
            {/* Social Media */}
        </>
    );
}