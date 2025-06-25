import ApiClient from './api-client.js';

const VAPID_PUBLIC_KEY = 'BCt85rHD9iVfSatIbRdDj-iUxF3BikTIVEHDdRbja4d2Ka41ok3tqG1QDt7Cj9-321agrYjFxmj0yv5KB2CBBZ0';

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await ApiClient.registerServiceWorker();
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
  return null;
}

export async function subscribeUserToPush(registration) {
  if (!registration || !('PushManager' in window)) return null;
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    await ApiClient.subscribePushNotification({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.toJSON().keys.p256dh,
        auth: subscription.toJSON().keys.auth
      }
    });
    console.log('Push notification subscription successful');
    return subscription;
  } catch (e) {
    console.error('Failed to subscribe the user: ', e);
    return null;
  }
}

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} 