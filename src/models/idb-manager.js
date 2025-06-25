// models/idb-manager.js
class IDBManager {
  constructor() {
    this.dbName = 'StoryAppDB';
    this.dbVersion = 1;
    this.storyStore = 'stories';
    this.draftStore = 'drafts';
    this.db = null;
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(this.storyStore)) {
          db.createObjectStore(this.storyStore, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(this.draftStore)) {
          db.createObjectStore(this.draftStore, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject('IndexedDB error: ' + event.target.error);
      };
    });
  }

  async saveStory(story) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storyStore], 'readwrite');
      const store = transaction.objectStore(this.storyStore);
      
      const request = store.put(story);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async saveDraft(draft) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.draftStore], 'readwrite');
      const store = transaction.objectStore(this.draftStore);
      
      const request = store.put(draft);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async getStories() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storyStore], 'readonly');
      const store = transaction.objectStore(this.storyStore);
      
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (event) => reject(event.target.error);
    });
  }

async deleteStory(id) {
  const db = await this.openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([this.storyStore], 'readwrite');
    const store = transaction.objectStore(this.storyStore);

    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}

  async getDrafts() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.draftStore], 'readonly');
      const store = transaction.objectStore(this.draftStore);
      
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async deleteDraft(id) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.draftStore], 'readwrite');
      const store = transaction.objectStore(this.draftStore);
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async clearAllData() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storyStore, this.draftStore], 'readwrite');
      
      transaction.objectStore(this.storyStore).clear();
      transaction.objectStore(this.draftStore).clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  }
}

const idbManager = new IDBManager();
export default idbManager;