import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from "../hooks/useNavigation";
import {
    navPetsSVG,
    navConsultasSVG,
    navVeterinariosSVG,
    navPerfilSVG
} from "./NavIcons";
import ThemeToggle from './ThemeToggle.jsx';

export default function NavBar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { currentSite, handleNavigation } = useNavigation();

    const handleLogout = () => {
        if (window.confirm('Tem certeza que deseja sair?')) {
            logout();
            navigate('/login');
        }
    };

    const navItems = [
        { id: "pets", label: "Pets", icon: navPetsSVG },
        { id: "consultas", label: "Consultas", icon: navConsultasSVG },
        { id: "veterinarios", label: "Veterinários", icon: navVeterinariosSVG },
        { id: "perfil", label: "Perfil", icon: navPerfilSVG }
    ];

    const logoutIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7Z" fill="currentColor" />
            <path d="M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor" />
        </svg>
    );

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <h2 className="logo-text">DuskPet</h2>
                    <ThemeToggle />
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button
                                className={`nav-item ${currentSite === item.id ? "active" : ""}`}
                                onClick={() => handleNavigation(item.id)}
                                aria-label={item.label}
                            >
                                <span className="nav-icon">
                                    {item.icon}
                                </span>
                                <span className="nav-label">{item.label}</span>
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            className="nav-item logout-nav-item"
                            onClick={handleLogout}
                            aria-label="Sair"
                            title="Sair"
                        >
                            <span className="nav-icon">
                                {logoutIcon}
                            </span>
                            <span className="nav-label">Sair</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
