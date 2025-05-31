// story-presenter.js
import StoryView from '../views/story-view.js';
import ApiClient from '../models/api-client.js';

class StoryPresenter {
  constructor(storyId) {
    this.storyId = storyId;
    this.view = new StoryView();
  }

  async showView(container) {
    try {
      const story = await this.loadStory();
      container.innerHTML = '';
      container.appendChild(this.view.getElement()); // Add to DOM first   
      this.view.displayStory(story); // Then initialize map
    } catch (error) {
      console.error('Error loading story:', error);
      this.view.showError('Failed to load story');
    }
  }

  async loadStory() {
    const response = await ApiClient.getStory(this.storyId);
    
    if (response.error) {
      throw new Error(response.message);
    }
    
    return response.story;
  }
}

export default StoryPresenter;