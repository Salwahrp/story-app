// register-view.js
class RegisterView {
    constructor() {
      this.element = this.createViewElement();
      this.onSubmit = null;
      this.onLoginClick = null;
      this.setupEventListeners();
    }
  
    createViewElement() {
      const element = document.createElement('div');
      element.className = 'register-view';
      
      element.innerHTML = `
        <h2>Register</h2>
        <form class="register-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8">
          </div>
          
          <button type="submit" class="submit-btn">Register</button>
        </form>
        
        <p class="login-link">Already have an account? <a href="#">Login here</a></p>
        <div class="message"></div>
      `;
      
      return element;
    }
  
    getElement() {
      return this.element;
    }
  
    setupEventListeners() {
        console.log('Setting up register form listeners');
      const form = this.element.querySelector('.register-form');
      const loginLink = this.element.querySelector('.login-link a');
      
      form.addEventListener('submit', (e) => {
        console.log('Form submit triggered');
        e.preventDefault();
        
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        
        if (this.onSubmit) {
          this.onSubmit({ name, email, password });
        }
      });
      
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.onLoginClick) {
          this.onLoginClick();
        }
      });
    }
  
    showSuccess(message) {
      const messageEl = this.element.querySelector('.message');
      messageEl.textContent = message;
      messageEl.className = 'message success';
    }
  
    showError(message) {
      const messageEl = this.element.querySelector('.message');
      messageEl.textContent = message;
      messageEl.className = 'message error';
    }
  }
  
  export default RegisterView;