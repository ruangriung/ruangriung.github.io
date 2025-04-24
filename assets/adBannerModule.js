/**
 * AdvancedAdBannerModule - Complete ad banner solution with AI/local image support
 */
const AdvancedAdBannerModule = (function() {
    // Private configuration
    const config = {
        banners: [
            {
                id: 'adBanner1',
                imageId: 'adImage1',
                currentType: 'ai', // 'ai' or 'local'
                aiPrompt: "Beautiful tropical beach vacation, advertisement style",
                localImage: 'assets/ruangriung.png',
                width: 300,
                height: 150,
                clickUrl: "https://pollinations.ai",
                overlayText: "Iklan by RuangRiung"
            },
            {
                id: 'adBanner2',
                imageId: 'adImage2',
                currentType: 'local',
                aiPrompt: "",
                localImage: 'assets/ruangriung.png',
                width: 300,
                height: 150,
                clickUrl: "https://ruangriung.my.id",
                overlayText: "Iklan by RuangRiung"
            }
        ],
        aiPrompts: [
            "Latest smartphone floating in space, product display, futuristic",
            "Delicious gourmet burger with melted cheese, food photography",
            "Luxury car on coastal road at sunset, cinematic, 8k",
             "Laptop illustration futuristic, cinematic, 8k",
            "Happy people using app on smartphones, social media ad"
        ],
        rotationInterval: 30000,
        currentLanguage: localStorage.getItem('language') || 'en'
    };

    // DOM elements cache
    const elements = {};
    
    // State
    const state = {
        rotationTimers: {}
    };

    /* Private Methods */

    function init() {
        // Initialize each banner
        config.banners.forEach((banner, index) => {
            setupBanner(banner, index);
        });

        updateAllTexts();
    }

    function setupBanner(banner, index) {
        // Cache elements
        elements[banner.id] = document.getElementById(banner.id);
        elements[banner.imageId] = document.getElementById(banner.imageId);
        
        if (!elements[banner.id] || !elements[banner.imageId]) {
            console.warn(`AdvancedAdBannerModule: Elements for banner ${banner.id} not found`);
            return;
        }

        // Set initial random prompt for AI banners
        if (banner.currentType === 'ai' && !banner.aiPrompt) {
            banner.aiPrompt = getRandomPrompt();
        }

        // Set local image path if specified
        if (banner.currentType === 'local' && banner.localImage) {
            banner.localImage = getLocalImagePath(banner.localImage);
        }

        // Set click handler
        elements[banner.imageId].addEventListener('click', () => {
            window.open(banner.clickUrl, '_blank');
        });

        // Set overlay text
        const overlay = elements[banner.id].querySelector('.ad-overlay');
        if (overlay) {
            overlay.textContent = banner.overlayText;
        }

        // Load first ad
        loadAd(banner, index);
        
        // Set up rotation if AI banner
        if (banner.currentType === 'ai') {
            startRotation(banner.id, index);
        }
    }

    function loadAd(banner, index) {
        const container = elements[banner.id];
        const loadingElement = container.querySelector('.ad-loading');
        const imageElement = elements[banner.imageId];
        
        // Show loading state
        loadingElement.style.display = 'flex';
        imageElement.style.display = 'none';

        if (banner.currentType === 'ai') {
            loadAiAd(banner, loadingElement, imageElement);
        } else {
            loadLocalAd(banner, loadingElement, imageElement);
        }
    }

    function loadAiAd(banner, loadingElement, imageElement) {
        const encodedPrompt = encodeURIComponent(banner.aiPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${banner.width}&height=${banner.height}&nologo=true`;
        
        imageElement.onload = function() {
            loadingElement.style.display = 'none';
            imageElement.style.display = 'block';
            imageElement.classList.remove('local-ad');
        };
        
        imageElement.onerror = function() {
            loadingElement.style.display = 'none';
            console.error(`AdvancedAdBannerModule: Failed to load AI ad for ${banner.id}`);
        };
        
        imageElement.src = imageUrl;
    }

    function loadLocalAd(banner, loadingElement, imageElement) {
        imageElement.onload = function() {
            loadingElement.style.display = 'none';
            imageElement.style.display = 'block';
            imageElement.classList.add('local-ad');
        };
        
        imageElement.onerror = function() {
            loadingElement.style.display = 'none';
            console.error(`AdvancedAdBannerModule: Failed to load local ad ${banner.localImage}`);
            // Fallback to AI ad
            convertToAiBanner(banner.id);
        };
        
        imageElement.src = banner.localImage;
    }

    function startRotation(bannerId, index) {
        // Clear existing timer
        if (state.rotationTimers[bannerId]) {
            clearInterval(state.rotationTimers[bannerId]);
        }
        
        // Set new rotation timer
        state.rotationTimers[bannerId] = setInterval(() => {
            rotateAd(index);
        }, config.rotationInterval);
    }

    function rotateAd(index) {
        const banner = config.banners[index];
        if (banner.currentType !== 'ai') return;

        banner.aiPrompt = getRandomPrompt(banner.aiPrompt);
        loadAd(banner, index);
    }

    function getRandomPrompt(currentPrompt = "") {
        let newPrompt;
        do {
            newPrompt = config.aiPrompts[Math.floor(Math.random() * config.aiPrompts.length)];
        } while (newPrompt === currentPrompt && config.aiPrompts.length > 1);
        return newPrompt;
    }

    function getLocalImagePath(filename) {
        if (filename.startsWith('http') || filename.startsWith('/')) {
            return filename;
        }
        return `assets/${filename}`;
    }

    function updateAllTexts() {
        const loadingTexts = document.querySelectorAll('.ad-loading-text');
        loadingTexts.forEach(text => {
            text.textContent = config.currentLanguage === 'en' ? 'Loading ad...' : 'Memuat iklan...';
        });
    }

    function convertToAiBanner(bannerId) {
        const bannerIndex = config.banners.findIndex(b => b.id === bannerId);
        if (bannerIndex >= 0) {
            const banner = config.banners[bannerIndex];
            banner.currentType = 'ai';
            banner.aiPrompt = getRandomPrompt();
            loadAd(banner, bannerIndex);
            startRotation(banner.id, bannerIndex);
        }
    }

    /* Public API */
    return {
        init: function() {
            document.addEventListener('DOMContentLoaded', init);
        },
        
        setLanguage: function(lang) {
            config.currentLanguage = lang;
            updateAllTexts();
        },
        
        setBannerType: function(bannerIndex, type, options = {}) {
            if (bannerIndex >= 0 && bannerIndex < config.banners.length) {
                const banner = config.banners[bannerIndex];
                
                // Clear existing rotation timer
                if (state.rotationTimers[banner.id]) {
                    clearInterval(state.rotationTimers[banner.id]);
                    delete state.rotationTimers[banner.id];
                }
                
                // Update banner configuration
                banner.currentType = type;
                
                if (type === 'ai') {
                    banner.aiPrompt = options.prompt || getRandomPrompt();
                    if (options.rotationInterval) {
                        config.rotationInterval = options.rotationInterval;
                    }
                    startRotation(banner.id, bannerIndex);
                } else {
                    banner.localImage = getLocalImagePath(options.imagePath || 'ruangriung.png');
                }
                
                if (options.overlayText) {
                    banner.overlayText = options.overlayText;
                    const overlay = document.querySelector(`#${banner.id} .ad-overlay`);
                    if (overlay) overlay.textContent = banner.overlayText;
                }
                
                if (options.clickUrl) {
                    banner.clickUrl = options.clickUrl;
                }
                
                loadAd(banner, bannerIndex);
            }
        },
        
        updateLocalImage: function(bannerIndex, imagePath) {
            this.setBannerType(bannerIndex, 'local', { imagePath });
        },
        
        updateAiBanner: function(bannerIndex, prompt) {
            this.setBannerType(bannerIndex, 'ai', { prompt });
        },
        
        destroy: function() {
            Object.values(state.rotationTimers).forEach(timer => {
                clearInterval(timer);
            });
        }
    };
})();

// Initialize the module
AdvancedAdBannerModule.init();