import HomePresenter from './presenters/home-presenter.js';
import StoryPresenter from './presenters/story-presenter.js';
import AddStoryPresenter from './presenters/add-story-presenter.js';
import LoginPresenter from './presenters/login-presenter.js';
import RegisterPresenter from './presenters/register-presenter.js';
import AuthManager from './models/auth-manager.js';

class App {
  constructor() {
    this.authManager = AuthManager;
    this.setupNavigation();
    this.setupViewTransition();
    this.setupAuthState();
    this.setupPWA();
  }

  setupNavigation() {
    window.addEventListener('hashchange', () => this.route());
    this.route();
  }

  setupViewTransition() {
    if (!document.startViewTransition) {
      document.startViewTransition = (callback) => callback();
    }
  }

  setupAuthState() {
    this.authManager.onAuthStateChanged((user) => {
      const loginNav = document.getElementById('login-nav');
      const registerNav = document.getElementById('register-nav');
      const logoutNav = document.getElementById('logout-nav');

      if (user) {
        loginNav.style.display = 'none';
        registerNav.style.display = 'none';
        logoutNav.style.display = 'block';
      } else {
        loginNav.style.display = 'block';
        registerNav.style.display = 'block';
        logoutNav.style.display = 'none';
      }
    });

    document.getElementById('logout-nav')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.authManager.logout();
      window.location.hash = '#/home';
    });
  }

  async route() {
    const hash = window.location.hash;
    let presenter;
    console.log('Routing to:', hash);

    document.startViewTransition(() => {
      if (hash === '#/home' || hash === '' || hash === '#') {
        presenter = new HomePresenter();
      } else if (hash.startsWith('#/stories/')) {
        const storyId = hash.split('/')[2];
        presenter = new StoryPresenter(storyId);
      } else if (hash === '#/add-story') {
        presenter = new AddStoryPresenter();
      } else if (hash === '#/login') {
        console.log('Routing to login Presenter');
        presenter = new LoginPresenter();
      } else if (hash === '#/register') {
        presenter = new RegisterPresenter();
      } else {
        // Handle 404
        document.getElementById('view-container').innerHTML = '<h2>Page Not Found</h2>';
        return;
      }

      if (presenter) {
        presenter.showView(document.getElementById('view-container'));
      }
    });
  }

  setupPWA() {
    let deferredPrompt;
    const installButton = document.getElementById('install-button');
    
    // Handle the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show the install button
      if (installButton) {
        installButton.style.display = 'block';
        
        // Add click event listener to the install button
        installButton.addEventListener('click', async () => {
          // Hide the install button
          installButton.style.display = 'none';
          
          // Show the install prompt
          deferredPrompt.prompt();
          
          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);
          
          // We no longer need the prompt. Clear it up
          deferredPrompt = null;
        });
      }
    });
    
    // Handle successful installation
    window.addEventListener('appinstalled', (evt) => {
      console.log('App was installed');
      if (installButton) {
        installButton.style.display = 'none';
      }
    });

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Running as PWA');
      if (installButton) {
        installButton.style.display = 'none';
      }
    }

    // Handle display mode changes
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
      if (evt.matches) {
        console.log('App is now running in standalone mode');
        if (installButton) {
          installButton.style.display = 'none';
        }
      }
    });
  }
}

new App();