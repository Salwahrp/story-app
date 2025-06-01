// presenters/home-presenter.js
import HomeView from '../views/home-view.js';
import ApiClient from '../models/api-client.js';
import AuthManager from '../models/auth-manager.js';
import IDBManager from '../models/idb-manager.js';

const VAPID_PUBLIC_KEY = 'BMyM2yXrYCtSZWVn-g9KzVmFBBEEGab1SyjuAECq2kMFwq2P2D3FT0jwLowVPNsLcmYG3Smr-n_C_3kZbUFiJX4';

class HomePresenter {
  constructor() {
    this.view = new HomeView();
    this.stories = [];
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
      
      // Save stories to IndexedDB for offline use
      await this.saveStoriesToIDB(this.stories);
      
      this.view.displayStories(this.stories);
    } catch (error) {
      console.error('Online fetch failed, trying IndexedDB:', error);
      
      // Fallback to IndexedDB when offline
      try {
        const offlineStories = await IDBManager.getStories();
        
        if (offlineStories && offlineStories.length > 0) {
          this.stories = offlineStories;
          this.view.displayStories(offlineStories);
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
  }

  async saveStoriesToIDB(stories) {
    try {
      // Clear old stories
      await IDBManager.clearAllData();
      
      // Save new stories
      for (const story of stories) {
        await IDBManager.saveStory(story);
      }
    } catch (error) {
      console.error('Error saving stories to IndexedDB:', error);
    }
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
        await this.saveStoriesToIDB(stories);
        this.view.displayStories(stories);
      } catch (error) {
        this.view.showError('Failed to refresh. Please check your connection.');
      }
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
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: ApiClient.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // Send subscription to server
        await ApiClient.subscribePushNotification({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.toJSON().keys.p256dh,
            auth: subscription.toJSON().keys.auth
          }
        });

        console.log('Successfully subscribed to push notifications');
      }
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  }
}

export default HomePresenter;