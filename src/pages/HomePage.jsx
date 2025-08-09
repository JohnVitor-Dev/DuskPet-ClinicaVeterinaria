import { useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar.jsx";

export default function HomePage() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    if (token) {
        return <Navigate to="/dashboard" />;
    }


    return (
        <div className="home-container">
            <TopBar />
            <div className="home-frame-main">
                <div className="home-main">
                    <h2>Bem-vindo à DuskPet</h2>
                    <p> A DuskPet é uma clínica veterinária especializada no cuidado com seu pet.
                        Nosso sistema foi desenvolvido para facilitar o agendamento de consultas,
                        acesso aos dados dos animais e controle eficiente de medicamentos.</p>
                </div>
                <div className="home-main-buttons">
                    <button onClick={() => navigate("/register")}>Registrar</button>
                    <p>Já possui uma conta? <a onClick={() => navigate("/login")}>Login</a></p>
                </div>
            </div>
        </div>
    );
}