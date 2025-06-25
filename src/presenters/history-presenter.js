import HistoryView from '../views/history-view.js';
import IDBManager from '../models/idb-manager.js';

class HistoryPresenter {
  constructor() {
    this.view = new HistoryView();
  }

  async showView(container) {
    container.innerHTML = '';
    container.appendChild(this.view.getElement());
    
    this.view.showLoading();
    
    try {
      const savedStories = await IDBManager.getStories();
      this.view.displayHistory(savedStories);
    } catch (error) {
      console.error('Error loading saved stories:', error);
      this.view.showError('Failed to load saved stories');
    }
    
    this.setupEventListeners();
    this.view.setupEventListeners();
  }

  setupEventListeners() {
    this.view.onStoryClick = (storyId) => {
      window.location.hash = `#/stories/${storyId}`;
    };
    
    this.view.onBack = () => {
      window.location.hash = '#/home';
    };
  }
}

export default HistoryPresenter; 