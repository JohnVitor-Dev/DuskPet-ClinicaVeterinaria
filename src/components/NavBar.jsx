import { useNavigation } from "../hooks/useNavigation";
import {
    navPetsSVG,
    navConsultasSVG,
    navVeterinariosSVG,
    navLojaSVG
} from "./NavIcons";
import ThemeToggle from './ThemeToggle.jsx';

export default function NavBar() {
    const { currentSite, handleNavigation } = useNavigation();

    const navItems = [
        { id: "pets", label: "Pets", icon: navPetsSVG },
        { id: "consultas", label: "Consultas", icon: navConsultasSVG },
        { id: "veterinarios", label: "Veterinários", icon: navVeterinariosSVG },
        { id: "loja", label: "Loja", icon: navLojaSVG }
    ];

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
                </ul>
            </nav>
        </aside>
    );
}
