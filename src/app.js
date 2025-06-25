import HomePresenter from './presenters/home-presenter.js';
import StoryPresenter from './presenters/story-presenter.js';
import AddStoryPresenter from './presenters/add-story-presenter.js';
import LoginPresenter from './presenters/login-presenter.js';
import RegisterPresenter from './presenters/register-presenter.js';
import HistoryPresenter from './presenters/history-presenter.js';
import AuthManager from './models/auth-manager.js';
import { registerServiceWorker, subscribeUserToPush } from './models/service-worker-helper.js';

class App {
  constructor() {
    this.authManager = AuthManager;
    this.setupNavigation();
    this.setupViewTransition();
    this.setupAuthState();
    this.setupPWA();
    this.setupServiceWorkerAndPush();
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
      } else if (hash === '#/history') {
        presenter = new HistoryPresenter();
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
      e.preventDefault();
      deferredPrompt = e;
      if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', async () => {
          installButton.style.display = 'none';
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);
          deferredPrompt = null;
        });
      }
    });
    window.addEventListener('appinstalled', (evt) => {
      console.log('App was installed');
      if (installButton) {
        installButton.style.display = 'none';
      }
    });
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Running as PWA');
      if (installButton) {
        installButton.style.display = 'none';
      }
    }
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
      if (evt.matches) {
        console.log('App is now running in standalone mode');
        if (installButton) {
          installButton.style.display = 'none';
        }
      }
    });
  }

  async setupServiceWorkerAndPush() {
    try {
      const registration = await registerServiceWorker();
      if (registration && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
        if (permission === 'granted') {
          await subscribeUserToPush(registration);
        }
      }
      // Handle service worker updates
      if (registration) {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error('Service Worker or Push setup failed:', error);
    }
  }
}

new App();