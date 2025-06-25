const API_BASE_URL = 'https://story-api.dicoding.dev/v1';
const VAPID_PUBLIC_KEY = 'BMyM2yXrYCtSZWVn-g9KzVmFBBEEGab1SyjuAECq2kMFwq2P2D3FT0jwLowVPNsLcmYG3Smr-n_C_3kZbUFiJX4';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async register({ name, email, password }) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    return response.json();
  }

  async login({ email, password }) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return response.json();
  }

  async getStories({ page = 1, size = 100, location = 0 } = {}) {
    const url = new URL(`${API_BASE_URL}/stories`);
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);
    url.searchParams.append('location', location);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.json();
  }

  async getStory(id) {
    const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.json();
  }

  async addStory({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);
    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });
    return response.json();
  }

  async subscribePushNotification(subscription) {
    const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(subscription),
    });
    return response.json();
  }

  async unsubscribePushNotification(endpoint) {
    const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ endpoint }),
    });
    return response.json();
  }

  // Improved service worker registration
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        console.log('ServiceWorker registration successful:', registration);
        return registration;
      } catch (err) {
        console.error('ServiceWorker registration failed:', err);
        throw err;
      }
    } else {
      throw new Error('Service Worker not supported');
    }
  }

  // Improved push subscription method
  async subscribeToPush(registration) {
    try {
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        // Check if the keys match
        const currentKey = subscription.options.applicationServerKey;
        const newKey = this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

        // Compare keys (as Uint8Array)
        if (currentKey && newKey && !areUint8ArraysEqual(currentKey, newKey)) {
          // Unsubscribe if keys are different
          await subscription.unsubscribe();
          subscription = null;
        } else {
          console.log('Already subscribed to push notifications');
          return subscription;
        }
      }

      // Subscribe to push notifications
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      console.log('Successfully subscribed to push notifications:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  // Helper method to convert VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }
}

// Helper to compare Uint8Arrays
function areUint8ArraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default new ApiClient();