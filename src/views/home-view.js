// home-view.js
class HomeView {
    constructor() {
      this.element = this.createViewElement();
      this.onStoryClick = null;
      this.onNextPage = null;
      this.onPrevPage = null;
      this.onAddStoryClick = null;
    }
  
    createViewElement() {
      const element = document.createElement('div');
      element.className = 'home-view';
          
      element.innerHTML = `
        <h2>Latest Stories</h2>
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
  
    displayStories(stories) {
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
        
        // Handle missing/undefined properties safely
        storyElement.innerHTML = `
          <img src="${story.photoUrl || './public/fallback-image.png'}" 
               alt="Story by ${story.name || 'Anonymous'}" 
               class="story-image"
               onerror="this.src='./public/fallback-image.png'">
          <h3>${story.name || 'Untitled Story'}</h3>
          <p>${story.description ? story.description.substring(0, 100) + '...' : 'No description'}</p>
          <small>${story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Unknown date'}</small>
        `;
        
        storyElement.addEventListener('click', () => {
          if (this.onStoryClick) this.onStoryClick(story.id);
        });
        
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


  }
  
  export default HomeView;