// story-presenter.js
import StoryView from '../views/story-view.js';
import ApiClient from '../models/api-client.js';
import IDBManager from '../models/idb-manager.js';

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
      await this.setupBookmarkLogic(story); //logic savebookmark & unsave
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

  // 🔽 Tambahkan fungsi ini
  async setupBookmarkLogic(story) {
    const bookmarkBtn = this.view.getElement().querySelector('#bookmark-btn');
    const unbookmarkBtn = this.view.getElement().querySelector('#unbookmark-btn');

    const allBookmarks = await IDBManager.getStories();
    const isBookmarked = allBookmarks.some(item => item.id === story.id);

    if (isBookmarked) {
      bookmarkBtn.style.display = 'none';
      unbookmarkBtn.style.display = 'inline-block';
    } else {
      bookmarkBtn.style.display = 'inline-block';
      unbookmarkBtn.style.display = 'none';
    }

    bookmarkBtn.addEventListener('click', async () => {
      await IDBManager.saveStory(story);
      bookmarkBtn.style.display = 'none';
      unbookmarkBtn.style.display = 'inline-block';
    });

    unbookmarkBtn.addEventListener('click', async () => {
      await IDBManager.deleteStory(story.id);
      bookmarkBtn.style.display = 'inline-block';
      unbookmarkBtn.style.display = 'none';
    });
  }
}

export default StoryPresenter;