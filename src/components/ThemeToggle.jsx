import useThemeToggle from "../hooks/useThemeToggle.jsx"

export default function ThemeToggle() {
    const [buttonClass, toggleTheme] = useThemeToggle();

    return (
        <button className={buttonClass} onClick={toggleTheme} />
    );
}
