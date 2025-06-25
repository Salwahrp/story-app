// home-view.js
class HomeView {
    constructor() {
      this.element = this.createViewElement();
      this.onStoryClick = null;
      this.onNextPage = null;
      this.onPrevPage = null;
      this.onAddStoryClick = null;
      this.onSaveToHistory = null;
      this.onViewHistory = null;
    }
  
    createViewElement() {
      const element = document.createElement('div');
      element.className = 'home-view';
          
      element.innerHTML = `
        <div class="header-actions">
          <h2>Latest Stories</h2>
          <button class="view-history-btn">View Saved History</button>
        </div>
        <div class="stories-container"></div>
        <div class="pagination">
          <button class="prev-btn">Previous</button>
          <button class="next-btn">Next</button>
        </div>
        <button class="add-story-btn" style="display: none;">Add Story</button>
      `;
      
      return element;
    }
  
    getElement() {
      return this.element;
    }
  
    displayStories(stories, savedStoryIds = new Set()) {
      const container = this.element.querySelector('.stories-container');
      container.innerHTML = '';
      
      // Validate input
      if (!stories || !Array.isArray(stories)) {
        this.showError('Invalid stories data');
        return;
      }
      
      if (stories.length === 0) {
        container.innerHTML = '<p>No stories found</p>';
        return;
      }
      
      // Create stories list
      stories.forEach(story => {
        if (!story || !story.id) return; // Skip invalid stories
        
        const storyElement = document.createElement('div');
        storyElement.className = 'story-card';
        
        const isSaved = savedStoryIds.has(story.id); // Check if story is already saved
        
        // Handle missing/undefined properties safely
        storyElement.innerHTML = `
          <img src="${story.photoUrl || './public/fallback-image.png'}" 
               alt="Story by ${story.name || 'Anonymous'}" 
               class="story-image"
               onerror="this.src='./public/fallback-image.png'">
          <h3>${story.name || 'Untitled Story'}</h3>
          <p>${story.description ? story.description.substring(0, 100) + '...' : 'No description'}</p>
          <small>${story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Unknown date'}</small>
          <button class="save-to-history-btn" data-story-id="${story.id}" ${isSaved ? 'disabled' : ''}>Save to History</button>
        `;
        
        // Add click event for the story
        storyElement.querySelector('.story-image').addEventListener('click', () => {
          if (this.onStoryClick) this.onStoryClick(story.id);
        });
        
        // Add click event for the save button
        const saveButton = storyElement.querySelector('.save-to-history-btn');
        // Only add listener if not already saved
        if (!isSaved) {
          saveButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent story click event
            if (this.onSaveToHistory) this.onSaveToHistory(story);
          });
        }
        
        container.appendChild(storyElement);
      });
    }
  
    enableAddStoryButton() {
      const btn = this.element.querySelector('.add-story-btn');
      btn.style.display = 'block';
      btn.addEventListener('click', this.onAddStoryClick);
    }
  
    showError(message) {
      const container = this.element.querySelector('.stories-container');
      container.innerHTML = `<div class="error">${message}</div>`;
    }

    showLoading() {
      const element = this.getElement();
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading';
      loadingDiv.innerHTML = 'Loading stories...';
      element.appendChild(loadingDiv);
    }
  
    showError(message) {
      const element = this.getElement();
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error';
      errorDiv.textContent = message;
      element.appendChild(errorDiv);
    }
  
    showOfflineWarning() {
      const element = this.getElement();
      const warningDiv = document.createElement('div');
      warningDiv.className = 'offline-warning';
      warningDiv.textContent = 'Showing offline content. Some data may be outdated.';
      element.appendChild(warningDiv);
    }

    setupEventListeners() {
      const viewHistoryBtn = this.element.querySelector('.view-history-btn');
      if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', () => {
          if (this.onViewHistory) this.onViewHistory();
        });
      }
    }
  }
  
  export default HomeView;