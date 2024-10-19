const loginRegisterOptions = document.querySelector('.loginRegisterOptions');
const loginPage = document.querySelector('.loginPage');
const registerPage = document.querySelector('.registerPage');
const mainIllustration = document.querySelector('.main-illustration');
const secondaryIllustration = document.querySelector('.secondary-illustration');
const mainIllustrationLogo = mainIllustration.querySelector('img');

let boolLight = false;

function showLoginPage() {
  loginRegisterOptions.classList.add('hidden');
  mainIllustration.classList.add('hidden');
  registerPage.classList.add('hidden');
  loginPage.classList.remove('hidden');
}

function showRegisterPage() {
  loginRegisterOptions.classList.add('hidden');
  mainIllustration.classList.add('hidden');
  registerPage.classList.remove('hidden');
  loginPage.classList.add('hidden');
}

function backToMain() {
  loginPage.classList.add('hidden');
  registerPage.classList.add('hidden');
  mainIllustration.classList.remove('hidden');
  loginRegisterOptions.classList.remove('hidden');
}

function colorTheme() {
  if (boolLight) {
    mainIllustrationLogo.src = "../assets/svg/undraw-veterinaryClinic.svg";
    document.documentElement.style.setProperty('--lamp', 'url(../assets/svg/lamp-light-off.svg)');
    document.documentElement.style.setProperty('--duskTheme', '#222222');
    document.documentElement.style.setProperty('--text', '#ffffff');
    boolLight = false;
    console.log("boolLight = false (desligado)");
  } else {
    mainIllustrationLogo.src = "../assets/svg/undraw-veterinaryClinic-light.svg";
    document.documentElement.style.setProperty('--lamp', 'url(../assets/svg/lamp-light-on.svg)');
    document.documentElement.style.setProperty('--duskTheme', '#ffffff');
    document.documentElement.style.setProperty('--text', '#000000');
    boolLight = true;
    console.log("boolLight = true (ligado)");
  }

}
