// register-presenter.js
import RegisterView from '../views/register-view.js';
import AuthManager from '../models/auth-manager.js';

class RegisterPresenter {
  constructor() {
    this.view = new RegisterView();
  }

  showView(container) {
    container.innerHTML = '';
    container.appendChild(this.view.getElement());
    this.view.setupEventListeners();
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.view.onSubmit = async (userData) => {
      try {

        await AuthManager.register(userData);
        this.view.showSuccess('Registration successful! Please login.');
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1500);
      } catch (error) {
        this.view.showError(error.message);
      }
    };
    
    this.view.onLoginClick = () => {
      window.location.hash = '#/login';
    };
  }
}         

export default RegisterPresenter;