// story-view.js
class StoryView {
    constructor() {
      this.element = this.createViewElement();
      this.map = null;
      this.marker = null;
    }
  
    createViewElement() {
      const element = document.createElement('div');
      element.className = 'story-view';
      
      element.innerHTML = `
        <div class="story-details">
      <div class="story-header">
        <h2 class="story-title"></h2>
        <p class="story-date"></p>
      </div>
      <img class="story-image" alt="Story image">
      <p class="story-description"></p>
      <div id="story-map" style="height: 300px;"></div> <p>
      
      <div class="bookmark-controls">
        <button id="bookmark-btn">Bookmark</button>
        <button id="unbookmark-btn" style="display: none;">Hapus Bookmark</button>
      </div>
    </div>
    <div class="message"></div>
  `;
      
      return element;
    }
  
    getElement() {
      return this.element;
    }
  
    displayStory(story) {
        this.element.querySelector('.story-title').textContent = story.name;
        this.element.querySelector('.story-date').textContent = new Date(story.createdAt).toLocaleString();
        this.element.querySelector('.story-image').src = story.photoUrl;
        this.element.querySelector('.story-image').alt = `Story by ${story.name}`;
        this.element.querySelector('.story-description').textContent = story.description;
        
        // Initialize map if location exists
        if (story.lat && story.lon) {
          const mapContainer = this.element.querySelector('#story-map');
          if (mapContainer) {
            // Wait for the element to be in DOM
            setTimeout(() => this.initMap(story.lat, story.lon), 0);
          }
        } else {
          const mapContainer = this.element.querySelector('#story-map');
          if (mapContainer) {
            mapContainer.style.display = 'none';
          }
        }
      }
  
      initMap(lat, lon) {
        try {
          if (typeof L === 'undefined') {
            throw new Error('Leaflet library not loaded');
          }
          
          const mapContainer = document.getElementById('story-map');
          if (!mapContainer || !mapContainer._leaflet_id) {
            this.map = L.map('story-map').setView([lat, lon], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
      
            this.marker = L.marker([lat, lon]).addTo(this.map)
              .bindPopup(`Story location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`)
              .openPopup();
          }
        } catch (error) {
          console.error('Map initialization failed:', error);
        }
      }
    
  
    showError(message) {
      const messageEl = this.element.querySelector('.message');
      messageEl.textContent = message;
      messageEl.className = 'message error';   
    }
  }
  
  export default StoryView;