import ThemeToggle from './ThemeToggle.jsx';

function AuthPage({ children }) {

    return (
        <>
            <div className={'main-container'}>
                <div className="title">
                    <div className="logo"></div>
                    <span className="name">DUSKPET</span>
                    <ThemeToggle />
                </div>

                <div className="frame-main">
                    <div className="secondary-illustration">
                        <div className='secondary-illustration-img'></div>
                    </div>

                    <div className="frame-secondary">
                        <div className='illustrationBackground'>
                            <div className="main-illustration"></div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthPage;
