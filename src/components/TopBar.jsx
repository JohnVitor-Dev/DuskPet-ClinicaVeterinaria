import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import { useState, useEffect } from 'react';

export default function TopBar() {
    const navigate = useNavigate();
    const [isLightMode, setIsLightMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'light';
    });

    useEffect(() => {
        const theme = isLightMode ? 'light' : 'dark';
        document.documentElement.className = `${theme}Mode`;
        localStorage.setItem('theme', theme);
    }, [isLightMode]);

    return (
        <div className="topbar-container">
            <div className="topbar-title">
                <div className="topbar-logo"></div>
                <span className="topbar-petshop-name">DUSKPET</span>
                <ThemeToggle isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
            </div>
        </div>
    );
}
