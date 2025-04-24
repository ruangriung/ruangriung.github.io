/**
 * AdvancedAdBannerModule - Complete Solution with Manual Control
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
                aiPrompt: "Quantum computer with glowing quantum bits, sci-fi laboratory setting",
                localImage: '',
                width: 300,
                height: 150,
                clickUrl: "https://ruangriung.my.id",
                overlayText: "Iklan by RuangRiung"
            },
            {
                id: 'adBanner2',
                imageId: 'adImage2',
                currentType: 'local',
                enabled: true,
                aiPrompt: "",
                localImage: 'ruangriung.png',
                width: 300,
                height: 150,
                clickUrl: "https://ruangriung.my.id",
                overlayText: "Iklan by RuangRiung"
            },
                          // New Banner 3
            {
                id: 'adBanner3',
                imageId: 'adImage3',
                currentType: 'ai', // Default to AI-generated
                enabled: false,
                aiPrompt: "Modern workspace with laptop and coffee, professional photo",
                localImage: '',
                width: 300,
                height: 150,
                clickUrl: "https://ruangriung.my.id/",
                overlayText: "Tampilkan produkmu Disini!"
            }
        ],
        aiPrompts: [
            "High-end gaming laptop with RGB lighting, cyberpunk style, holographic interface, product shot",
        "Wireless earbuds with glowing effects, floating in mid-air, studio lighting, commercial photography",
        "Smartwatch with futuristic UI display, macro shot, water droplets, reflective surface",
        "VR headset in a digital metaverse environment, neon grid, cyberpunk aesthetic",
        "Drone flying over mountain landscape at golden hour, 8k cinematic photography",
        "Robot assistant serving coffee in modern office, futuristic technology, warm lighting",
        "3D printer creating intricate object, glowing filament, macro photography",
        "Gaming console with colorful particle effects, dynamic lighting, product display",
        "Futuristic electric car dashboard with holographic navigation, night scene",
        "Satellite orbiting Earth with solar panels extended, space background, ultra HD",
        "Augmented reality glasses projecting interface, tech-savvy person using them",
        "Mechanical keyboard with customizable RGB lighting, macro shot, bokeh background",
        "Security camera with AI recognition, glowing red light, cyberpunk atmosphere",
        "Quantum computer with glowing quantum bits, sci-fi laboratory setting"
        ],
        rotationInterval: 30000,
        currentLanguage: localStorage.getItem('language') || 'en',
        moduleEnabled: true // Global enable/disable switch
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
        
        // Enable/disable entire module
        setModuleEnabled: function(enabled) {
            config.moduleEnabled = enabled;
            if (enabled) {
                this.init();
            } else {
                this.disableAllBanners();
            }
        },
        
        // Enable/disable specific banner
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
        
        // Disable all banners
        disableAllBanners: function() {
            config.banners.forEach((banner, index) => {
                this.setBannerEnabled(index, false);
            });
        },
        
        // Enable all banners
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

/* 
Contoh penggunaan kontrol manual:

1. Nonaktifkan seluruh modul iklan:
AdvancedAdBannerModule.setModuleEnabled(false);

2. Aktifkan kembali seluruh modul iklan:
AdvancedAdBannerModule.setModuleEnabled(true);

3. Nonaktifkan banner spesifik (0 untuk banner pertama, 1 untuk kedua):
AdvancedAdBannerModule.setBannerEnabled(0, false);

4. Aktifkan kembali banner spesifik:
AdvancedAdBannerModule.setBannerEnabled(0, true);

5. Nonaktifkan semua banner:
AdvancedAdBannerModule.disableAllBanners();

6. Aktifkan semua banner:
AdvancedAdBannerModule.enableAllBanners();
*/
