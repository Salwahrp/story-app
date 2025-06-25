// views/history-view.js
class HistoryView {
  constructor() {
    this.element = this.createViewElement();
    this.onStoryClick = null;
    this.onBack = null;
  }

  createViewElement() {
    const element = document.createElement('div');
    element.className = 'history-view';
    
    element.innerHTML = `
      <div class="header-actions">
        <h2>Saved History</h2>
        <button class="back-btn">Back to Stories</button>
      </div>
      <div class="history-container"></div>
    `;
    
    return element;
  }

  getElement() {
    return this.element;
  }

  displayHistory(stories) {
    const container = this.element.querySelector('.history-container');
    container.innerHTML = '';
    
    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      container.innerHTML = '<p>No saved stories found</p>';
      return;
    }
    
    stories.forEach(story => {
      if (!story || !story.id) return;
      
      const storyElement = document.createElement('div');
      storyElement.className = 'story-card';
      
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

  showError(message) {
    const container = this.element.querySelector('.history-container');
    container.innerHTML = `<div class="error">${message}</div>`;
  }

  showLoading() {
    const container = this.element.querySelector('.history-container');
    container.innerHTML = '<div class="loading">Loading saved stories...</div>';
  }

  setupEventListeners() {
    const backBtn = this.element.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.onBack) this.onBack();
      });
    }
  }
}

export default HistoryView; 