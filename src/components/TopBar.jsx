import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle.jsx';

export default function TopBar() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Tem certeza que deseja sair?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="topbar-container">
            <div className="topbar-title">
                <div className="topbar-logo"></div>
                <span className="topbar-petshop-name">DUSKPET</span>
                <div className="topbar-actions">
                    <ThemeToggle />
                    {user && (
                        <button
                            className="logout-button"
                            onClick={handleLogout}
                            title="Sair"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span className="logout-text">Sair</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
