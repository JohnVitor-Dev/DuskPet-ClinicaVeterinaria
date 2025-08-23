import { useState, useRef } from "react";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const nomeRef = useRef(null);
    const celularRef = useRef(null);
    const emailRef = useRef(null);
    const senhaRef = useRef(null);
    const confirmarSenhaRef = useRef(null);

    const handleFocus = (ref) => {
        if (ref.current) {
            ref.current.focus({
                preventScroll: true
            });
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        console.log(email, senha);
        // backend
    };

    return (
        <>
            <div className="registerPage">
                <h2>Criar sua Conta</h2>
                <form className="registerForm" onSubmit={handleRegister}>
                    <input type="text" placeholder="Nome Completo" ref={nomeRef} onFocus={() => handleFocus(nomeRef)} required />
                    <input type="tel" placeholder="Celular" ref={celularRef} onFocus={() => handleFocus(celularRef)} required />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} ref={emailRef} onFocus={() => handleFocus(emailRef)} required />
                    <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} ref={senhaRef} onFocus={() => handleFocus(senhaRef)} required />
                    <input type="password" placeholder="Confirme sua Senha" ref={confirmarSenhaRef} onFocus={() => handleFocus(confirmarSenhaRef)} required />
                    <button className="button" type="submit">Registrar</button>
                    <p className="login-link">Já possui uma conta? <a href="/login">Faça login</a></p>
                </form>
            </div>
        </>
    );
}