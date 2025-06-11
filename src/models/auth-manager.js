import ApiClient from './api-client.js';

class AuthManager {
  constructor() {
    this.listeners = [];
    this.user = JSON.parse(localStorage.getItem('user'));
    this.token = localStorage.getItem('token');
  }

  onAuthStateChanged(listener) {
    this.listeners.push(listener);
    // Call immediately with current state
    listener(this.user);
  }

  async register({ name, email, password }) {
    try {
      const result = await ApiClient.register({ name, email, password });
      if (result.error) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const result = await ApiClient.login({ email, password });
      if (result.error) {
        throw new Error(result.message);
      }

      this.user = result.loginResult;
      this.token = result.loginResult.token;
      
      ApiClient.setToken(this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('token', this.token);
      
      this.notifyListeners();
      return result;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    ApiClient.clearToken();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.notifyListeners();
  }

  isAuthenticated() {
    return !!this.user;
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }
}

const authManagerInstance = new AuthManager();
export default authManagerInstance;