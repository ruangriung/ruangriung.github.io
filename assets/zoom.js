/**
 * Zoom Overlay for RuangRiung AI Image Generator - Fixed Top Right Position
 */
document.addEventListener('DOMContentLoaded', function() {
    const generatedImage = document.getElementById('generated-image');
    const imageContainer = document.getElementById('generated-image-container');
    
    // Create zoom overlay elements
    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'zoom-overlay';
    zoomOverlay.style.display = 'none';
    
    const zoomImage = document.createElement('img');
    zoomImage.className = 'zoom-image';
    
    const zoomCloseBtn = document.createElement('button');
    zoomCloseBtn.className = 'zoom-close-btn';
    zoomCloseBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    zoomOverlay.appendChild(zoomImage);
    zoomOverlay.appendChild(zoomCloseBtn);
    document.body.appendChild(zoomOverlay);
    
    // Add zoom button directly to the image container
    const zoomBtn = document.createElement('button');
    zoomBtn.className = 'zoom-btn';
    zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
    zoomBtn.title = 'Zoom Image';
    
    // Create a container for the zoom button
    const zoomBtnContainer = document.createElement('div');
    zoomBtnContainer.className = 'zoom-btn-container';
    zoomBtnContainer.appendChild(zoomBtn);
    
    // Insert the zoom button container into the image container
    if (imageContainer) {
        imageContainer.appendChild(zoomBtnContainer);
    }
    
    // Style the zoom elements
    addZoomStyles();
    
    // Event listeners
    zoomBtn.addEventListener('click', openZoomOverlay);
    zoomCloseBtn.addEventListener('click', closeZoomOverlay);
    zoomOverlay.addEventListener('click', function(e) {
        if (e.target === zoomOverlay) {
            closeZoomOverlay();
        }
    });
    
    // Handle keyboard events
    document.addEventListener('keydown', function(e) {
        if (zoomOverlay.style.display === 'block' && e.key === 'Escape') {
            closeZoomOverlay();
        }
    });
    
    // Update button position when image loads or resizes
    const updateZoomButtonPosition = () => {
        if (!generatedImage || !zoomBtn) return;
        
        const imgRect = generatedImage.getBoundingClientRect();
        const containerRect = imageContainer.getBoundingClientRect();
        
        // Position the button in the top-right corner of the image
        zoomBtn.style.position = 'absolute';
        zoomBtn.style.top = '10px';
        zoomBtn.style.right = '10px';
        zoomBtn.style.bottom = 'auto';
        zoomBtn.style.left = 'auto';
    };
    
    const resizeObserver = new ResizeObserver(updateZoomButtonPosition);
    if (imageContainer) {
        resizeObserver.observe(imageContainer);
    }
    
    // Initial position update
    updateZoomButtonPosition();
    
    // Functions
    function openZoomOverlay() {
        if (!generatedImage?.src || generatedImage.src === '') {
            return;
        }
        
        zoomImage.src = generatedImage.src;
        zoomOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeZoomOverlay() {
        zoomOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    function addZoomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .zoom-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: zoom-out;
            }
            
            .zoom-image {
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                transform-origin: center center;
                transition: transform 0.3s ease;
            }
            
            .zoom-close-btn {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.5);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1001;
                transition: all 0.3s ease;
            }
            
            .zoom-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .zoom-btn-container {
                position: absolute;
                top: 0;
                right: 0;
                width: 0;
                height: 0;
            }
            
            .zoom-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: var(--primary);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                font-size: 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                opacity: 0.9;
                border: 2px solid rgba(255, 255, 255, 0.8);
            }
            
            .zoom-btn:hover {
                opacity: 1;
                transform: scale(1.1);
                background: var(--primary-dark);
            }
            
            @media (max-width: 768px) {
                .zoom-overlay {
                    background-color: rgba(0, 0, 0, 0.95);
                }
                
                .zoom-image {
                    max-width: 100%;
                    max-height: 100%;
                }
                
                .zoom-btn {
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                    top: 8px;
                    right: 8px;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Update on new image generation
document.addEventListener('imageGenerated', function() {
    const generatedImage = document.getElementById('generated-image');
    const zoomImage = document.querySelector('.zoom-image');
    const zoomBtn = document.querySelector('.zoom-btn');
    
    if (generatedImage && zoomImage) {
        zoomImage.src = generatedImage.src;
    }
    
    if (zoomBtn) {
        zoomBtn.style.top = '10px';
        zoomBtn.style.right = '10px';
        zoomBtn.style.bottom = 'auto';
        zoomBtn.style.left = 'auto';
    }
});