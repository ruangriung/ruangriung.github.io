/**
 * AdvancedAdBannerModule - Complete Solution with Full-Width Banners
 */
const AdvancedAdBannerModule = (function() {
    // Private configuration
    const config = {
        banners: [
            {
                id: 'adBanner1',
                imageId: 'adImage1',
                currentType: 'ai',
                enabled: false,
                aiPrompt: "Modern digital marketing concept with vibrant colors, abstract design",
                localImage: '',
                width: '100%',  // Full width
                height: 'auto', // Auto height
                clickUrl: "https://ruangriung.my.id",
                overlayText: "Advertisement by RuangRiung"
            },
            {
                id: 'adBanner2',
                imageId: 'adImage2',
                currentType: 'local',
                enabled: true,
                aiPrompt: "",
                localImage: 'ruangriung.png',
                width: '100%',  // Full width
                height: 'auto', // Auto height
                clickUrl: "https://ruangriung.my.id",
                overlayText: "Advertisement by RuangRiung"
            },
            {
                id: 'adBanner3',
                imageId: 'adImage3',
                currentType: 'ai',
                enabled: false,
                aiPrompt: "Creative workspace with laptop and plants, professional environment",
                localImage: '',
                width: '100%',  // Full width
                height: 'auto', // Auto height
                clickUrl: "https://ruangriung.my.id/",
                overlayText: "Show your product here!"
            }
        ],
        aiPrompts: [
            "High-end product display with clean background, studio lighting, e-commerce style",
            "Abstract technology background with glowing elements, digital art",
            "Happy diverse people using technology in modern environment",
            "Nature landscape with digital overlay, futuristic eco-friendly concept",
            "Minimalist design with bold typography, modern advertising style"
        ],
        rotationInterval: 30000,
        currentLanguage: localStorage.getItem('language') || 'en',
        moduleEnabled: true
    };

    // DOM elements cache
    const elements = {};
    
    // State
    const state = {
        rotationTimers: {}
    };

    /* Private Methods */

    function init() {
        if (!config.moduleEnabled) return;

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

        // Set initial state
        if (!banner.enabled) {
            elements[banner.id].style.display = 'none';
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

        // Set full-width styling
        elements[banner.id].style.width = '100%';
        elements[banner.imageId].style.width = '100%';
        
        // Load first ad
        loadAd(banner, index);
        
        // Set up rotation if AI banner
        if (banner.currentType === 'ai' && banner.enabled) {
            startRotation(banner.id, index);
        }
    }

    function loadAd(banner, index) {
        if (!banner.enabled) {
            elements[banner.id].style.display = 'none';
            return;
        }

        const container = elements[banner.id];
        const loadingElement = container.querySelector('.ad-loading');
        const imageElement = elements[banner.imageId];
        
        // Show loading state
        loadingElement.style.display = 'flex';
        imageElement.style.display = 'none';
        container.style.display = 'block';

        // Apply full-width styling
        imageElement.style.width = '100%';
        imageElement.style.height = banner.height === 'auto' ? 'auto' : `${banner.height}px`;

        if (banner.currentType === 'ai') {
            loadAiAd(banner, loadingElement, imageElement);
        } else {
            loadLocalAd(banner, loadingElement, imageElement);
        }
    }

    function loadAiAd(banner, loadingElement, imageElement) {
        // Handle full-width parameters
        const widthParam = banner.width === '100%' ? '1024' : banner.width;
        const heightParam = banner.height === 'auto' ? '300' : banner.height;
        
        const encodedPrompt = encodeURIComponent(banner.aiPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${widthParam}&height=${heightParam}&nologo=true`;
        
        imageElement.onload = function() {
            loadingElement.style.display = 'none';
            imageElement.style.display = 'block';
            imageElement.classList.remove('local-ad');
            
            // Maintain full-width display
            if (banner.width === '100%') {
                imageElement.style.width = '100%';
                imageElement.style.height = 'auto';
                imageElement.style.maxHeight = '400px'; // Prevent excessive height
            }
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
            
            // Maintain full-width display
            if (banner.width === '100%') {
                imageElement.style.width = '100%';
                imageElement.style.height = 'auto';
                imageElement.style.maxHeight = '400px'; // Prevent excessive height
            }
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
        if (banner.currentType !== 'ai' || !banner.enabled) return;

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

    function cleanupBanner(bannerId) {
        // Clear timer
        if (state.rotationTimers[bannerId]) {
            clearInterval(state.rotationTimers[bannerId]);
            delete state.rotationTimers[bannerId];
        }
        
        // Hide banner
        const bannerElement = document.getElementById(bannerId);
        if (bannerElement) {
            bannerElement.style.display = 'none';
        }
    }

    /* Public API */
    return {
        init: function() {
            document.addEventListener('DOMContentLoaded', init);
        },
        
        setModuleEnabled: function(enabled) {
            config.moduleEnabled = enabled;
            if (enabled) {
                this.init();
            } else {
                this.disableAllBanners();
            }
        },
        
        setBannerEnabled: function(bannerIndex, enabled) {
            if (bannerIndex >= 0 && bannerIndex < config.banners.length) {
                const banner = config.banners[bannerIndex];
                banner.enabled = enabled;
                
                if (enabled) {
                    loadAd(banner, bannerIndex);
                    if (banner.currentType === 'ai') {
                        startRotation(banner.id, bannerIndex);
                    }
                } else {
                    cleanupBanner(banner.id);
                }
            }
        },
        
        disableAllBanners: function() {
            config.banners.forEach((banner, index) => {
                this.setBannerEnabled(index, false);
            });
        },
        
        enableAllBanners: function() {
            config.banners.forEach((banner, index) => {
                this.setBannerEnabled(index, true);
            });
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
                    if (banner.enabled) {
                        startRotation(banner.id, bannerIndex);
                    }
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
                
                // Maintain full-width settings
                banner.width = '100%';
                banner.height = 'auto';
                
                if (banner.enabled) {
                    loadAd(banner, bannerIndex);
                }
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
            
            config.banners.forEach(banner => {
                const imageElement = document.getElementById(banner.imageId);
                if (imageElement) {
                    imageElement.removeEventListener('click', () => {});
                }
            });
        }
    };
})();

// Initialize the module
AdvancedAdBannerModule.init();