// add-story-presenter.js
import AddStoryView from '../views/add-story-view.js';
import ApiClient from '../models/api-client.js';
import AuthManager from '../models/auth-manager.js';

class AddStoryPresenter {
    constructor() {
        this.view = new AddStoryView();  // This should be the only initialization
        this.selectedLocation = null;
        
        // Don't call setupEventListeners() here anymore
      }

      async showView(container) {
        if (!AuthManager.isAuthenticated()) {
          window.location.hash = '#/login';
          return;
        }
      
        container.innerHTML = '';
        
        // Create new view instance SALWAAAAAAAAA
        this.view = new AddStoryView();
        
        // Add to DOM first
        container.appendChild(this.view.getElement());
        
        // Initialize map
        this.view.initMap();
        
        // Set up presenter handlers
        this.setupEventListeners();
        
        // Then set up view's DOM event listeners
        this.view.setupEventListeners();
      }

  setupEventListeners() {
    console.log("Setting up presenter handlers");
    this.view.onMapClick = (lat, lng) => {
      this.selectedLocation = { lat, lng };
      this.view.updateLocationMarker(lat, lng);
    };

    this.view.onSubmit = async (formData) => {
        console.log("Presenter onSubmit handler called");
      try {
        const { description, photo } = formData;
        console.log("Mau Upload Story", { description, photo }); 
        const response = await ApiClient.addStory({
          description,
          photo,
          lat: this.selectedLocation?.lat,
          lon: this.selectedLocation?.lng
        });
        
        if (response.error) {
          throw new Error(response.message);
        }
        
        this.view.showSuccess('Story added successfully!');
        setTimeout(() => {
          window.location.hash = '#/home';
        }, 1500);
        
        // Request notification permission and subscribe if granted
        this.requestNotificationPermission(description);
      } catch (error) {
        console.error('Error adding story:', error);
        this.view.showError(error.message);
      }
    };

    this.view.onCancel = () => {
      window.location.hash = '#/home';
    };
  }

  async requestNotificationPermission(description) {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        try {
          const reg = await navigator.serviceWorker.ready;
          const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BMyM2yXrYCtSZWVn-g9KzVmFBBEEGab1SyjuAECq2kMFwq2P2D3FT0jwLowVPNsLcmYG3Smr-n_C_3kZbUFiJX4'
          });
          
          await ApiClient.subscribePushNotification({
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.toJSON().keys.p256dh,
              auth: subscription.toJSON().keys.auth
            }
          });
          
          console.log('Successfully subscribed to push notifications after adding story');
        } catch (error) {
          console.error('Error subscribing to push notifications:', error);
        }
      }
    }
  }

  async onSubmit(formData) {
    try {
      const response = await ApiClient.addStory(formData);
      if (response.error) throw new Error(response.message);
      
      // Show success
    } catch (error) {
      console.error('Online submission failed, saving draft');
      await IDBManager.saveDraft({
        ...formData,
        createdAt: new Date().toISOString()
      });
      this.view.showError('Story saved as draft. Will sync when online.');
    }
  }
}

export default AddStoryPresenter;