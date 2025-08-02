import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Login from './Login.jsx';

import veterinaryIllustration from '../assets/svg/undraw-veterinaryClinic.svg';
import veterinaryIllustrationDark from '../assets/svg/undraw-veterinaryClinicDark.svg';

export default function Home() {
    const navigate = useNavigate();
    const [isLightMode, setIsLightMode] = useState(false);

    useEffect(() => {
        document.documentElement.className = isLightMode ? 'lightMode' : 'darkMode';
    }, [isLightMode]);

    return (
        <>
            <div className={'main-container'}>
                <div className="title">
                    <div className="logo"></div>
                    <span className="name">DUSKPET</span>
                    <ThemeToggle isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
                </div>

                <div className="frame-main">
                    <div className="secondary-illustration">
                        <img src={isLightMode ? veterinaryIllustrationDark : veterinaryIllustration} alt="Ilustração veterinária" />
                    </div>

                    <div className="frame-secondary">
                        <div className="main-illustration">
                            <img src={isLightMode ? veterinaryIllustrationDark : veterinaryIllustration} alt="Ilustração principal" />
                        </div>
                        <Login />
                    </div>
                </div>
            </div>
        </>
    );
}
