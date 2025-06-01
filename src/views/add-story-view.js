class AddStoryView {
  constructor() {
    this.element = this.createViewElement();
    this.map = null;
    this.marker = null;
    this.onSubmit = null;
    this.onCancel = null;
    this.onMapClick = null;
    this.capturedPhoto = null;
  }

  createViewElement() {
    const element = document.createElement('div');
    element.className = 'add-story-view';
    
    element.innerHTML = `
      <h2>Add New Story</h2>
      <form class="story-form">
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" required></textarea>
        </div>
        
        <div class="form-group">
          <label>Photo</label>
          <div class="photo-container">
            <button type="button" class="camera-btn">Take Photo</button>
            <div class="photo-preview" id="photo-preview"></div>
          </div>
          <input type="file" id="photo-input" accept="image/*" capture="environment" style="display: none;">
        </div>
        
        <div class="form-group">
          <label>Location (click on map to set)</label>
          <div id="map" style="height: 300px;"></div>
          <p id="location-info">No location selected</p>
        </div>
        
        <div class="form-actions">
          <button type="button" class="cancel-btn">Cancel</button>
          <button type="submit" class="submit-btn">Submit</button>
        </div>
      </form>
      <div class="message"></div>
    `;
    
    return element;
  }

  getElement() {
    return this.element;
  }

  initMap() {
    // Initialize map with default view
    this.map = L.map('map').setView([0, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    
    // Add click event to map
    this.map.on('click', (e) => {
      if (this.onMapClick) {
        this.onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });
    
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.map.setView([latitude, longitude], 13);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }

  updateLocationMarker(lat, lng) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    
    this.marker = L.marker([lat, lng]).addTo(this.map)
      .bindPopup(`Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      .openPopup();
    
    document.getElementById('location-info').textContent = 
      `Selected location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  setupEventListeners() {
    const form = this.element.querySelector('.story-form');
    const cancelBtn = this.element.querySelector('.cancel-btn');
    const cameraBtn = this.element.querySelector('.camera-btn');
    const photoInput = this.element.querySelector('#photo-input');
    const photoPreview = this.element.querySelector('#photo-preview');

    // Handle camera button click
    // Handle camera button click
cameraBtn.addEventListener('click', async () => {
  const originalText = cameraBtn.textContent;
  console.log("TESTTTTT KAMERAAA")
  try {
    // Update button state
    cameraBtn.disabled = true;
    cameraBtn.textContent = 'Accessing camera...';
    
    // First try using the MediaDevices API (modern browsers)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Use rear camera
        },
        audio: false
      });
      
      // Create a video element for preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Replace photo preview with video
      photoPreview.innerHTML = '';
      photoPreview.appendChild(video);
      
      // Create canvas for capturing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Create capture button
      const captureBtn = document.createElement('button');
      captureBtn.textContent = 'Capture Photo';
      captureBtn.className = 'capture-btn';
      photoPreview.appendChild(captureBtn);
      
      captureBtn.addEventListener('click', () => {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          this.capturedPhoto = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          
          // Show captured image
          const img = document.createElement('img');
          img.src = URL.createObjectURL(blob);
          img.style.maxWidth = '100%';
          img.style.maxHeight = '200px';
          
          photoPreview.innerHTML = '';
          photoPreview.appendChild(img);
          
          // Stop video stream
          stream.getTracks().forEach(track => track.stop());
          
          // Reset camera button
          cameraBtn.disabled = false;
          cameraBtn.textContent = originalText;
        }, 'image/jpeg', 0.9);
      });
    } else {
      throw new Error('Camera API not available');
    }
  } catch (error) {
    console.error('Camera error:', error);
    
    // Reset button state
    cameraBtn.disabled = false;
    cameraBtn.textContent = originalText;
    
    // Show error to user
    this.showError('Could not access camera. Using file upload instead.');
    
    // Fallback to file input
    photoInput.click();
  }
});
    // Keep the file input change handler as fallback
    photoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.capturedPhoto = e.target.files[0];
        
        const reader = new FileReader();
        reader.onload = (event) => {
          photoPreview.innerHTML = '';
          const img = document.createElement('img');
          img.src = event.target.result;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '200px';
          photoPreview.appendChild(img);
        };
        reader.readAsDataURL(this.capturedPhoto);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const description = form.description.value;

      if (!this.capturedPhoto) {
        this.showError('Please take a photo');
        return;
      }
      
      if (this.capturedPhoto.size > 1024 * 1024) { // 1MB
        this.showError('Photo must be less than 1MB');
        return;
      }
      
      if (this.onSubmit) {
        this.onSubmit({ 
          description, 
          photo: this.capturedPhoto 
        });
      }
    });
    
    cancelBtn.addEventListener('click', () => {
      if (this.onCancel) {
        this.onCancel();
      }
    });
  }

  showSuccess(message) {
    const messageEl = this.element.querySelector('.message');
    messageEl.textContent = message;
    messageEl.className = 'message success';
  }

  showError(message) {
    const messageEl = this.element.querySelector('.message');
    messageEl.textContent = message;
    messageEl.className = 'message error';
  }

  clearForm() {
    this.element.querySelector('.story-form').reset();
    this.element.querySelector('#photo-preview').innerHTML = '';
    this.element.querySelector('#location-info').textContent = 'No location selected';
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    this.capturedPhoto = null;
  }
}

export default AddStoryView;