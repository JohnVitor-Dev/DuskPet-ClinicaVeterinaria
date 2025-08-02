export default function ThemeToggle({ isLightMode, setIsLightMode }) {

    return (
        <button className={isLightMode ? "colorTheme-btn on" : "colorTheme-btn off"} onClick={() => setIsLightMode(prev => !prev)}></button>
    );
}
