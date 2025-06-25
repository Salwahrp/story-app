// login-view.js

/**
 * Template for the login form
 * @type {string}
 */
const LOGIN_TEMPLATE = `
  <h2>Login</h2>
  <form class="login-form">
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required minlength="8">
    </div>
    
    <button type="submit" class="submit-btn">Login</button>
  </form>
  
  <p class="register-link">Don't have an account? <a href="#">Register here</a></p>
  <div class="message"></div>
`;

/**
 * Class representing the login view
 */
class LoginView {
  /**
   * Create a new LoginView instance
   */
  constructor() {
    this.element = this.createViewElement();
    this.onSubmit = null;
    this.onRegisterClick = null;
    this.setupEventListeners();
  }

  /**
   * Creates the view element with the login form
   * @returns {HTMLElement} The created element
   */
  createViewElement() {
    const element = document.createElement('div');
    element.className = 'login-view';
    element.innerHTML = LOGIN_TEMPLATE;
    return element;
  }

  /**
   * Returns the view element
   * @returns {HTMLElement} The view element
   */
  getElement() {
    return this.element;
  }

  /**
   * Sets up event listeners for the form and register link
   * @private
   */
  setupEventListeners() {
    const form = this.element.querySelector('.login-form');
    const registerLink = this.element.querySelector('.register-link a');
    
    if (!form || !registerLink) {
      throw new Error('Required form elements not found');
    }

    form.addEventListener('submit', this.handleSubmit.bind(this));
    registerLink.addEventListener('click', this.handleRegisterClick.bind(this));
  }

  /**
   * Handles form submission
   * @param {Event} e - The submit event
   * @private
   */
  handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!this.validateInput(email, password)) {
      return;
    }

    if (typeof this.onSubmit === 'function') {
      this.onSubmit({ email, password });
    }
  }

  /**
   * Handles register link click
   * @param {Event} e - The click event
   * @private
   */
  handleRegisterClick(e) {
    e.preventDefault();
    if (typeof this.onRegisterClick === 'function') {
      this.onRegisterClick();
    }
  }

  /**
   * Validates the form input
   * @param {string} email - The email to validate
   * @param {string} password - The password to validate
   * @returns {boolean} Whether the input is valid
   * @private
   */
  validateInput(email, password) {
    if (!email || !password) {
      this.showError('Please fill in all fields');
      return false;
    }

    if (!this.isValidEmail(email)) {
      this.showError('Please enter a valid email address');
      return false;
    }

    if (password.length < 8) {
      this.showError('Password must be at least 8 characters long');
      return false;
    }

    return true;
  }

  /**
   * Validates an email address
   * @param {string} email - The email to validate
   * @returns {boolean} Whether the email is valid
   * @private
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Shows a success message
   * @param {string} message - The message to show
   */
  showSuccess(message) {
    this.updateMessage(message, 'success');
  }

  /**
   * Shows an error message
   * @param {string} message - The message to show
   */
  showError(message) {
    this.updateMessage(message, 'error');
  }

  /**
   * Updates the message element with the given message and type
   * @param {string} message - The message to show
   * @param {string} type - The type of message (success/error)
   * @private
   */
  updateMessage(message, type) {
    const messageEl = this.element.querySelector('.message');
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `message ${type}`;
    }
  }
}

export default LoginView;