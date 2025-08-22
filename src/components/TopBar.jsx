import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

export default function TopBar() {
    const navigate = useNavigate();

    return (
        <div className="topbar-container">
            <div className="topbar-title">
                <div className="topbar-logo"></div>
                <span className="topbar-petshop-name">DUSKPET</span>
                <ThemeToggle />
            </div>
        </div>
    );
}
