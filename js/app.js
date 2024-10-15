const mainIllustration = document.querySelector('.main-illustration');
const loginRegisterOptions = document.querySelector('.loginRegisterOptions');
const loginPage = document.querySelector('.loginPage');
const registerPage = document.querySelector('.registerPage');

function showLoginPage() {
  loginRegisterOptions.classList.add('hidden');
  mainIllustration.classList.add('hidden');
  loginPage.classList.remove('hidden');
  console.log('showLoginPage');
}

function showRegisterPage() {}

function backToMain() {
  loginPage.classList.add('hidden');
  registerPage.classList.add('hidden');
  mainIllustration.classList.remove('hidden');
  loginRegisterOptions.classList.remove('hidden');
}
