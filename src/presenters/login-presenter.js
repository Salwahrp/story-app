// login-presenter.js
import LoginView from '../views/login-view.js';
import AuthManager from '../models/auth-manager.js';

class LoginPresenter {
  constructor() {
    console.log("Running to logging view")
    this.view = new LoginView();
  }

  showView(container) {

    console.log("showView called with container:", container);

    if (!container) {
        console.error("No container element provided!");
        return;
    } 
    
    // if (AuthManager.isAuthenticated()) {
    //   window.location.hash = '#/home';
    //   return;
    // }

    console.log("Running to logging view v2")
    container.innerHTML = '';
    console.log('Container before:', container.innerHTML);
    container.appendChild(this.view.getElement());
    console.log('Containerrrrrrr');
    console.log('Container after:', container.innerHTML); // Debug
    console.log('Form exists?:', container.querySelector('.login-form')); 
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.view.onSubmit = async (credentials) => {
      try {
        await AuthManager.login(credentials);
        this.view.showSuccess('Login successful!');
        setTimeout(() => {
          window.location.hash = '#/home';
        }, 1000);
      } catch (error) {
        this.view.showError(error.message);
      }
    };
    
    this.view.onRegisterClick = () => {
      window.location.hash = '#/register';
    };
  }
}

export default LoginPresenter;