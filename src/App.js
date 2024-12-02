import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isRegisterPage, setIsRegisterPage] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleColorTheme = () => {
    setIsLightMode((prevMode) => !prevMode);
    if (isLightMode) {
      document.documentElement.style.setProperty('--lamp', 'url(../assets/svg/lamp-light-off.svg)');
      document.documentElement.style.setProperty('--duskTheme', '#222222');
      document.documentElement.style.setProperty('--text', '#ffffff');
    } else {
      document.documentElement.style.setProperty('--lamp', 'url(../assets/svg/lamp-light-on.svg)');
      document.documentElement.style.setProperty('--duskTheme', '#ffffff');
      document.documentElement.style.setProperty('--text', '#000000');
    };
  };

  const showLoginPage = () => {
    setIsLoginPage(true);
    setIsRegisterPage(false);
  };

  const showRegisterPage = () => {
    setIsRegisterPage(true);
    setIsLoginPage(false);
  };

  const backToMain = () => {
    setIsLoginPage(false);
    setIsRegisterPage(false);
  };

  return (
    <div className="main-container">
      <div className="title">
        <div className="logo"></div>
        <span className="name">DUSKPET</span>
        <button className="colorTheme-btn" onClick={toggleColorTheme}></button>
      </div>

      <div className="frame-main">
        <div className="secondary-illustration">
          <img
            src={isLightMode ? '/assets/svg/undraw-veterinaryClinic-light.svg' : '/assets/svg/undraw-veterinaryClinic.svg'}
            alt="Ilustração veterinária"
          />
        </div>

        <div className="frame-secondary">
          <div className="main-illustration">
            <img
              src={isLightMode ? '/assets/svg/undraw-veterinaryClinic-light.svg' : '/assets/svg/undraw-veterinaryClinic.svg'}
              alt="Ilustração principal"
            />
          </div>

          {!isLoginPage && !isRegisterPage && (
            <div className="loginRegisterOptions">
              <p>Acesse DuskPet!</p>
              <button className="button" onClick={showLoginPage}>
                Login
              </button>
              <button className="button button-register" onClick={showRegisterPage}>
                Cadastre-se
              </button>
            </div>
          )}

          {isLoginPage && (
            <div className="loginPage">
              <button className="button back-btn" onClick={backToMain}>
                <img src="/assets/svg/back-arrow.svg" alt="Voltar" />
              </button>
              <h2>Login</h2>
              <div className="loginForm">
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Senha" />
                <p>Esqueceu a senha?</p>
                <button className="button">Entrar</button>
              </div>
              <div className="social-login">
                <p>_________ Acesse com _________</p>
                <div className="social-login-btns">
                  <button className="button">
                    <img src="/assets/svg/facebook-ic.svg" alt="Facebook" />
                  </button>
                  <button className="button">
                    <img src="/assets/svg/google-ic.svg" alt="Google" />
                  </button>
                  <button className="button">
                    <img src="/assets/svg/cib-apple.svg" alt="Apple" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {isRegisterPage && (
            <div className="registerPage">
              <button className="button back-btn" onClick={backToMain}>
                <img src="/assets/svg/back-arrow.svg" alt="Voltar" />
              </button>
              <h2>Cadastre-se</h2>
              <div className="registerForm">
                <input type="text" placeholder="Nome" />
                <input type="text" placeholder="Sobrenome" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Senha" />
                <input type="password" placeholder="Confirme a senha" />
                <button className="button">Cadastrar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
