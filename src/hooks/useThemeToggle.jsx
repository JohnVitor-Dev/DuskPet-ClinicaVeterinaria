import { useState, useEffect } from 'react';

const THEME_KEY = 'theme';

export default function useThemeToggle(defaultTheme = 'light') {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(THEME_KEY) || defaultTheme;
    });

    const [buttonClass, setButtonClass] = useState(() => {
        return theme === 'light' ? "colorTheme-btn on" : "colorTheme-btn off";
    });

    useEffect(() => {
        document.documentElement.className = `${theme}Mode`;
        localStorage.setItem(THEME_KEY, theme);
        setButtonClass(theme === 'light' ? "colorTheme-btn on" : "colorTheme-btn off");
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return [buttonClass, toggleTheme];
}