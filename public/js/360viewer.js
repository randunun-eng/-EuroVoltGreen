// 360-degree product viewer for Eurovolt products
class ProductViewer360 {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            totalFrames: 36, // Number of images in 360 sequence
            autoRotate: false,
            autoRotateSpeed: 2,
            sensitivity: 5,
            inertia: true,
            ...options
        };
        
        this.currentFrame = 0;
        this.isMouseDown = false;
        this.lastMouseX = 0;
        this.velocity = 0;
        this.images = [];
        this.isLoaded = false;
        this.autoRotateTimer = null;
        
        this.init();
    }

    init() {
        this.setupHTML();
        this.preloadImages();
        this.bindEvents();
    }

    setupHTML() {
        this.container.innerHTML = `
            <div class="viewer-360-wrapper">
                <div class="viewer-360-stage">
                    <img class="viewer-360-image" alt="360° Product View" />
                </div>
                <div class="viewer-360-controls">
                    <button class="viewer-360-control" data-action="prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="viewer-360-control" data-action="autorotate">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="viewer-360-control" data-action="next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="viewer-360-loading">
                    <div class="spinner"></div>
                    <span>Loading 360° view...</span>
                </div>
                <div class="viewer-360-progress">
                    <div class="progress-bar"></div>
                </div>
            </div>
        `;

        this.stage = this.container.querySelector('.viewer-360-stage');
        this.image = this.container.querySelector('.viewer-360-image');
        this.loading = this.container.querySelector('.viewer-360-loading');
        this.progressBar = this.container.querySelector('.progress-bar');
        this.controls = this.container.querySelector('.viewer-360-controls');

        // Add CSS styles
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('viewer-360-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'viewer-360-styles';
        styles.textContent = `
            .viewer-360-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
                border-radius: 10px;
                background: #f8f9fa;
                cursor: grab;
            }
            
            .viewer-360-wrapper:active {
                cursor: grabbing;
            }
            
            .viewer-360-stage {
                width: 100%;
                height: 100%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .viewer-360-image {
                max-width: 100%;
                max-height: 100%;
                user-select: none;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            
            .viewer-360-controls {
                position: absolute;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                background: rgba(0,0,0,0.7);
                padding: 8px 15px;
                border-radius: 25px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .viewer-360-wrapper:hover .viewer-360-controls {
                opacity: 1;
            }
            
            .viewer-360-control {
                background: none;
                border: none;
                color: white;
                padding: 8px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .viewer-360-control:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }
            
            .viewer-360-control.active {
                background: var(--primary-color, #0056b3);
            }
            
            .viewer-360-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: #666;
            }
            
            .viewer-360-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: rgba(0,0,0,0.1);
                border-radius: 0 0 10px 10px;
            }
            
            .progress-bar {
                height: 100%;
                background: var(--primary-color, #0056b3);
                width: 0%;
                transition: width 0.3s ease;
                border-radius: 0 0 10px 10px;
            }
            
            @media (max-width: 768px) {
                .viewer-360-controls {
                    opacity: 1;
                    bottom: 10px;
                }
                
                .viewer-360-control {
                    width: 40px;
                    height: 40px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    preloadImages() {
        const productName = this.container.dataset.product || 'default';
        const basePath = '/static/images/products/';
        const loadedImages = [];
        let loadedCount = 0;

        // Since we don't have actual 360° images, we'll use the available stock images
        // and simulate multiple frames by applying CSS transforms
        const baseImage = this.getProductImage(productName);
        
        // Create simulation of 360 frames using transforms
        for (let i = 0; i < this.options.totalFrames; i++) {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                const progress = (loadedCount / this.options.totalFrames) * 100;
                this.progressBar.style.width = `${progress}%`;
                
                if (loadedCount === this.options.totalFrames) {
                    this.onImagesLoaded();
                }
            };
            
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === this.options.totalFrames) {
                    this.onImagesLoaded();
                }
            };
            
            img.src = baseImage;
            loadedImages.push({
                image: img,
                rotation: (360 / this.options.totalFrames) * i
            });
        }
        
        this.images = loadedImages;
    }

    getProductImage(productName) {
        // Map product names to their respective images
        const productImages = {
            'EV-5000H': 'https://pixabay.com/get/g40a3bc7d37cc90e9f39ad90b0c898ba5d38a81fea861f41783b4b0f245bd6cf9317eb79f31800390f287d9bc23f1e486020a7820f46fb7ad94df73be9f291bec_1280.jpg',
            'EV-10000H': 'https://pixabay.com/get/g18cfaee0ec58a55dac867cb010b9fe0f167673c4913bfd710bcf2d65d5cb163d4ac48a8b5e8e15060dff8f7e31033527099c852e5ec5dabfcc78dce6aec7b142_1280.jpg',
            'EV-15000H': 'https://pixabay.com/get/g34b778ed9b2168c572c087b153a587f6fab56c1a5c00411542699c7cba7ce783a632f78a3f541b6150d4a9414656994b6836127b88f3b9e2423b9c002fa094d5_1280.jpg'
        };
        
        return productImages[productName] || productImages['EV-5000H'];
    }

    onImagesLoaded() {
        this.isLoaded = true;
        this.loading.style.display = 'none';
        this.showFrame(0);
        
        if (this.options.autoRotate) {
            this.startAutoRotate();
        }
    }

    showFrame(frameIndex) {
        if (!this.isLoaded || !this.images[frameIndex]) return;
        
        this.currentFrame = frameIndex;
        const frameData = this.images[frameIndex];
        
        this.image.src = frameData.image.src;
        this.image.style.transform = `rotateY(${frameData.rotation}deg)`;
        
        // Update progress indicator
        const progress = (frameIndex / (this.options.totalFrames - 1)) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    nextFrame() {
        const nextIndex = (this.currentFrame + 1) % this.options.totalFrames;
        this.showFrame(nextIndex);
    }

    prevFrame() {
        const prevIndex = (this.currentFrame - 1 + this.options.totalFrames) % this.options.totalFrames;
        this.showFrame(prevIndex);
    }

    startAutoRotate() {
        if (this.autoRotateTimer) return;
        
        const rotateButton = this.controls.querySelector('[data-action="autorotate"] i');
        rotateButton.className = 'fas fa-pause';
        
        this.autoRotateTimer = setInterval(() => {
            this.nextFrame();
        }, 1000 / this.options.autoRotateSpeed);
    }

    stopAutoRotate() {
        if (this.autoRotateTimer) {
            clearInterval(this.autoRotateTimer);
            this.autoRotateTimer = null;
            
            const rotateButton = this.controls.querySelector('[data-action="autorotate"] i');
            rotateButton.className = 'fas fa-play';
        }
    }

    toggleAutoRotate() {
        if (this.autoRotateTimer) {
            this.stopAutoRotate();
        } else {
            this.startAutoRotate();
        }
    }

    bindEvents() {
        // Mouse events for manual rotation
        this.stage.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.lastMouseX = e.clientX;
            this.velocity = 0;
            this.stopAutoRotate();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isMouseDown) return;
            
            const deltaX = e.clientX - this.lastMouseX;
            const frameDelta = Math.floor(deltaX / this.options.sensitivity);
            
            if (frameDelta !== 0) {
                const newFrame = (this.currentFrame + frameDelta + this.options.totalFrames) % this.options.totalFrames;
                this.showFrame(newFrame);
                this.velocity = frameDelta;
            }
            
            this.lastMouseX = e.clientX;
        });

        document.addEventListener('mouseup', () => {
            if (this.isMouseDown && this.options.inertia) {
                this.applyInertia();
            }
            this.isMouseDown = false;
        });

        // Touch events for mobile
        this.stage.addEventListener('touchstart', (e) => {
            this.isMouseDown = true;
            this.lastMouseX = e.touches[0].clientX;
            this.velocity = 0;
            this.stopAutoRotate();
        });

        this.stage.addEventListener('touchmove', (e) => {
            if (!this.isMouseDown) return;
            e.preventDefault();
            
            const deltaX = e.touches[0].clientX - this.lastMouseX;
            const frameDelta = Math.floor(deltaX / this.options.sensitivity);
            
            if (frameDelta !== 0) {
                const newFrame = (this.currentFrame + frameDelta + this.options.totalFrames) % this.options.totalFrames;
                this.showFrame(newFrame);
                this.velocity = frameDelta;
            }
            
            this.lastMouseX = e.touches[0].clientX;
        });

        this.stage.addEventListener('touchend', () => {
            if (this.isMouseDown && this.options.inertia) {
                this.applyInertia();
            }
            this.isMouseDown = false;
        });

        // Control button events
        this.controls.addEventListener('click', (e) => {
            const button = e.target.closest('.viewer-360-control');
            if (!button) return;
            
            const action = button.dataset.action;
            
            switch (action) {
                case 'prev':
                    this.stopAutoRotate();
                    this.prevFrame();
                    break;
                case 'next':
                    this.stopAutoRotate();
                    this.nextFrame();
                    break;
                case 'autorotate':
                    this.toggleAutoRotate();
                    break;
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.container.matches(':hover')) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.stopAutoRotate();
                    this.prevFrame();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.stopAutoRotate();
                    this.nextFrame();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAutoRotate();
                    break;
            }
        });
    }

    applyInertia() {
        if (Math.abs(this.velocity) < 1) return;
        
        const inertiaTimer = setInterval(() => {
            this.velocity *= 0.95; // Friction factor
            
            if (Math.abs(this.velocity) < 0.1) {
                clearInterval(inertiaTimer);
                return;
            }
            
            const frameDelta = Math.floor(this.velocity);
            if (frameDelta !== 0) {
                const newFrame = (this.currentFrame + frameDelta + this.options.totalFrames) % this.options.totalFrames;
                this.showFrame(newFrame);
            }
        }, 16);
    }

    destroy() {
        if (this.autoRotateTimer) {
            clearInterval(this.autoRotateTimer);
        }
        this.container.innerHTML = '';
    }
}

// Initialize 360° viewers on page load
document.addEventListener('DOMContentLoaded', function() {
    const viewers = [];
    
    // Find all 360° viewer containers
    document.querySelectorAll('.product-image-360').forEach(container => {
        const viewer = new ProductViewer360(container, {
            totalFrames: 24, // Reduced for better performance
            autoRotate: false,
            sensitivity: 8
        });
        viewers.push(viewer);
    });
    
    // Export to global scope for external access
    window.ProductViewers360 = viewers;
    
    console.log(`Initialized ${viewers.length} 360° product viewers`);
});

// Export the class for use in other modules
window.ProductViewer360 = ProductViewer360;
