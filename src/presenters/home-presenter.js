// presenters/home-presenter.js
import HomeView from '../views/home-view.js';
import ApiClient from '../models/api-client.js';
import AuthManager from '../models/auth-manager.js';
import IDBManager from '../models/idb-manager.js';

class HomePresenter {
  constructor() {
    this.view = new HomeView();
    this.stories = [];
    this.savedStoryIds = new Set();
    this.loadSavedStoryIds();
  }

  async loadSavedStoryIds() {
    try {
      const savedStories = await IDBManager.getStories();
      this.savedStoryIds = new Set(savedStories.map(story => story.id));
    } catch (error) {
      console.error('Error loading saved story IDs:', error);
    }
  }

  async showView(container) {
    container.innerHTML = '';
    container.appendChild(this.view.getElement());
    
    this.view.showLoading();
    
    try {
      // First check if user is authenticated
      if (!AuthManager.isAuthenticated()) {
        // Show login prompt instead of error
        this.view.showError('Please login to view stories');
        return;
      }

      // Set up push notifications if not already subscribed
      await this.setupPushNotifications();

      // Try to get stories from API first
      const response = await ApiClient.getStories();
      
      // Check if response contains stories array
      if (!response || !response.listStory) {
        throw new Error('Invalid response format');
      }
      
      this.stories = response.listStory;
      
      // Display stories without automatically saving to IndexedDB
      this.view.displayStories(this.stories, this.savedStoryIds);
    } catch (error) {
      console.error('Online fetch failed, trying IndexedDB:', error);
      
      // Fallback to IndexedDB when offline
      try {
        const offlineStories = await IDBManager.getStories();
        
        if (offlineStories && offlineStories.length > 0) {
          this.stories = offlineStories;
          this.view.displayStories(offlineStories, this.savedStoryIds);
          this.view.showOfflineWarning();
        } else {
          this.view.showError('Unable to load stories. Please check your connection and login status.');
        }
      } catch (idbError) {
        console.error('IndexedDB error:', idbError);
        this.view.showError('Failed to load stories from any source.');
      }
    }
    
    this.setupEventListeners();
    this.view.setupEventListeners();
  }

  setupEventListeners() {
    this.view.onStoryClick = (storyId) => {
      window.location.hash = `#/stories/${storyId}`;
    };
    
    this.view.onRefresh = async () => {
      this.view.showLoading();
      try {
        const stories = await ApiClient.getStories();
        this.stories = stories;
        await this.loadSavedStoryIds();
        this.view.displayStories(stories, this.savedStoryIds);
      } catch (error) {
        this.view.showError('Failed to refresh. Please check your connection.');
      }
    };

    // Add handler for saving stories to history
    this.view.onSaveToHistory = async (story) => {
      try {
        await IDBManager.saveStory(story);
        this.savedStoryIds.add(story.id);
        // Show success message
        const saveButton = document.querySelector(`[data-story-id="${story.id}"]`);
        if (saveButton) {
          saveButton.textContent = 'Saved!';
          saveButton.disabled = true;
        }
      } catch (error) {
        console.error('Error saving story to history:', error);
        // Show error message
        const saveButton = document.querySelector(`[data-story-id="${story.id}"]`);
        if (saveButton) {
          const originalText = saveButton.textContent;
          saveButton.textContent = 'Error saving';
          setTimeout(() => {
            saveButton.textContent = originalText;
          }, 2000);
        }
      }
    };

    // Add handler for viewing history
    this.view.onViewHistory = () => {
      window.location.hash = '#/history';
    };
  }

  async setupPushNotifications() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('Push notifications not supported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Use API client's improved methods
        const registration = await ApiClient.registerServiceWorker();
        const subscription = await ApiClient.subscribeToPush(registration);

        // Send subscription to server
        await ApiClient.subscribePushNotification({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.toJSON().keys.p256dh,
            auth: subscription.toJSON().keys.auth
          }
        });

        console.log('Successfully subscribed to push notifications');
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  }
}

export default HomePresenter;