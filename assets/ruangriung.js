// Language translations
const translations = {
    en: {
        title: "RuangRiung AI Image Generator",
        subtitle: "Transform your imagination into stunning visuals with AI",
        darkMode: "Dark Mode",
        lightMode: "Light Mode",
        promptPlaceholder: "Describe your dream image in detail... (e.g. A cyberpunk cityscape at night with neon lights, 8k ultra detailed, cinematic lighting)",
        enhanceBtn: "Enhance",
        generateBtn: "Generate",
        batchCount: "Batch Count",
        batchGenerate: "Generate Batch",
        batchNote: "Generate multiple variations at once (max 10)",
        imageDimensions: "Image Dimensions",
        width: "Width:",
        height: "Height:",
        aspectRatio: "Aspect Ratio:",
        modelNotes: "Model Notes for dimensions",
        aiModel: "AI Model",
        artStyle: "Art Style",
        quality: "Quality",
        advancedSettings: "Advanced Settings",
        lighting: "Lighting",
        colorPalette: "Color Palette",
        composition: "Composition",
        seed: "Seed (for consistency)",
        hd: "HD Resolution",
        safeFilter: "Safe Filter (NSFW protection)",
        enhanceDetails: "Enhance Details",
        loadingText: "Preparing the best results for you... Please wait",
        download: "Download",
        share: "Share",
        remix: "Remix",
        variation: "Variation",
        savePrompt: "Save Prompt",
        history: "Generation History",
        clearHistory: "Clear History",
        savedPrompts: "Saved Prompts",
        resetAll: "Reset All Settings",
        englishNote: "Write in English for accurate results",
        clear: "Clear",
        modelNotesContent: [
            "Optimal image size range: 512–2048 pixels (for both width and height)",
            "Recommended sizes: 512×512, 768×768, 1024×1024, 1024×1536 — depending on your hardware capability",
            "Avoid non-multiples of 64 like 500×600 or 1023×1023, as they may cause errors or degraded performance"
        ],
        filters: "Filters",
        aiEnhance: "AI Enhance",
        enhanceFaces: "Enhance Faces",
        enhanceBackground: "Enhance Background",
        increaseSharpness: "Increase Sharpness",
        colorCorrection: "Color Correction",
        reduceNoise: "Reduce Noise",
        // Add these to both en and id translations
analyzeImage: "Analyze Image",
imageAnalysis: "Image Analysis",
uploadImage: "Upload Image",
analyzingImage: "Analyzing image...",
analysisResult: "Analysis Result",
useAsPrompt: "Use as Prompt",
noDescription: "No description available",
failedToAnalyze: "Failed to analyze image. Please try again."
    },
    id: {
        title: "RuangRiung Generator Gambar AI",
        subtitle: "Ubah imajinasi Anda menjadi visual menakjubkan dengan AI",
        darkMode: "Mode Gelap",
        lightMode: "Mode Terang",
        promptPlaceholder: "Jelaskan gambar impian Anda secara detail... (contoh: Pemandangan kota cyberpunk di malam hari dengan lampu neon, detail ultra 8k, pencahayaan sinematik)",
        enhanceBtn: "Tingkatkan",
        generateBtn: "Hasilkan",
        batchCount: "Jumlah Batch",
        batchGenerate: "Hasilkan Batch",
        batchNote: "Hasilkan beberapa variasi sekaligus (maks 10)",
        imageDimensions: "Dimensi Gambar",
        width: "Lebar:",
        height: "Tinggi:",
        aspectRatio: "Rasio Aspek:",
        modelNotes: "Catatan Model untuk dimensi",
        aiModel: "Model AI",
        artStyle: "Gaya Seni",
        quality: "Kualitas",
        advancedSettings: "Pengaturan Lanjutan",
        lighting: "Pencahayaan",
        colorPalette: "Palet Warna",
        composition: "Komposisi",
        seed: "Seed (untuk konsistensi)",
        hd: "Resolusi HD",
        safeFilter: "Filter Aman (perlindungan NSFW)",
        enhanceDetails: "Tingkatkan Detail",
        loadingText: "Mempersiapkan hasil terbaik untuk Anda... Mohon tunggu",
        download: "Unduh",
        share: "Bagikan",
        remix: "Remix",
        variation: "Variasi",
        savePrompt: "Simpan Prompt",
        history: "Riwayat Generasi",
        clearHistory: "Hapus Riwayat",
        savedPrompts: "Prompt Tersimpan",
        resetAll: "Atur Ulang Semua Pengaturan",
        englishNote: "Tulis dalam bahasa Inggris untuk hasil yang akurat",
        clear: "Hapus",
        modelNotesContent: [
            "Rentang ukuran gambar optimal: 512–2048 piksel (untuk lebar dan tinggi)",
            "Ukuran yang direkomendasikan: 512×512, 768×768, 1024×1024, 1024×1536 — tergantung kemampuan perangkat keras Anda",
            "Hindari kelipatan non-64 seperti 500×600 atau 1023×1023, karena dapat menyebabkan kesalahan atau penurunan performa"
        ],
        filters: "Filter",
        aiEnhance: "Peningkatan AI",
        enhanceFaces: "Tingkatkan Wajah",
        enhanceBackground: "Tingkatkan Latar Belakang",
        increaseSharpness: "Tingkatkan Ketajaman",
        colorCorrection: "Koreksi Warna",
        reduceNoise: "Kurangi Noise",
        // Add these to both en and id translations
analyzeImage: "Analyze Image",
imageAnalysis: "Image Analysis",
uploadImage: "Upload Image",
analyzingImage: "Analyzing image...",
analysisResult: "Analysis Result",
useAsPrompt: "Use as Prompt",
noDescription: "No description available",
failedToAnalyze: "Failed to analyze image. Please try again."
    }
};

// Initialize SweetAlert
const Swal = window.Swal;

// SweetAlert helper functions
function showSweetAlert(title, text, icon = 'success', confirmButtonText = 'OK') {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: confirmButtonText,
        confirmButtonColor: '#6c5ce7',
        background: getComputedStyle(document.body).getPropertyValue('--bg'),
        color: getComputedStyle(document.body).getPropertyValue('--text'),
        backdrop: `
            rgba(0,0,0,0.5)
            url("assets/ripple.gif")
            center top
            no-repeat
        `
    });
}

async function showConfirm(title, text, confirmButtonText = 'Yes', cancelButtonText = 'Cancel') {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#6c5ce7',
        cancelButtonColor: '#d63031',
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        background: getComputedStyle(document.body).getPropertyValue('--bg'),
        color: getComputedStyle(document.body).getPropertyValue('--text')
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Elements
    const promptTextarea = document.getElementById('prompt-textarea');
    const generateBtn = document.getElementById('generate-btn');
    const enhanceBtn = document.getElementById('enhance-btn');
    const generatedImage = document.getElementById('generated-image');
    const loadingElement = document.querySelector('.loading');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const remixBtn = document.getElementById('remix-btn');
    const variationBtn = document.getElementById('variation-btn');
    const savePromptBtn = document.getElementById('save-prompt-btn');
    const errorMessage = document.getElementById('error-message');
    const historyPanel = document.getElementById('history-panel');
    const historyList = document.getElementById('history-list');
    const resetHistoryBtn = document.getElementById('reset-history-btn');
    const savedPromptsPanel = document.getElementById('saved-prompts-panel');
    const savedPromptsList = document.getElementById('saved-prompts-list');
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedContent = document.getElementById('advanced-content');
    const advancedArrow = document.getElementById('advanced-arrow');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const widthSlider = document.getElementById('width-slider');
    const heightSlider = document.getElementById('height-slider');
    const widthValue = document.getElementById('width-value');
    const heightValue = document.getElementById('height-value');
    const aspectRatioDisplay = document.getElementById('aspect-ratio-display');
    const modelSelect = document.getElementById('model');
    const clearBtn = document.getElementById('clear-btn');
    const batchCountInput = document.getElementById('batch-count');
    const batchGenerateBtn = document.getElementById('batch-generate-btn');
    const modelNotesToggle = document.getElementById('model-notes-toggle');
    const modelNotesContent = document.getElementById('model-notes-content');
    const modelNotesArrow = document.getElementById('model-notes-arrow');
    const promptSuggestionsContainer = document.getElementById('prompt-suggestions');
    const suggestionsLoading = document.getElementById('suggestions-loading');
    const refreshSuggestionsBtn = document.getElementById('refresh-suggestions');
    const loadingText = document.getElementById('loading-text');
    const englishNote = document.querySelector('.note');
    const languageToggle = document.getElementById('language-toggle');
    const langEn = document.getElementById('lang-en');
    const langId = document.getElementById('lang-id');
    const filterControls = document.getElementById('filter-controls');
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const enhanceToggleBtn = document.getElementById('enhance-toggle-btn');
    const aiEnhancePanel = document.getElementById('ai-enhance-panel');
    const brightnessFilter = document.getElementById('brightness-filter');
    const contrastFilter = document.getElementById('contrast-filter');
    const saturationFilter = document.getElementById('saturation-filter');
    const blurFilter = document.getElementById('blur-filter');
    const filterPresets = document.querySelectorAll('.filter-preset');
    const enhanceOptions = document.querySelectorAll('.enhance-option');
    const imageInfo = document.getElementById('image-info');
    const enhanceProgress = document.getElementById('enhance-progress');
    const enhanceProgressBar = document.getElementById('enhance-progress-bar');

    // Textarea expansion elements
    const expandTextareaBtn = document.getElementById('expand-textarea-btn');
    const textareaModal = document.getElementById('textarea-modal');
    const fullscreenTextarea = document.getElementById('fullscreen-textarea');
    const closeTextareaModal = document.getElementById('close-textarea-modal');
    const saveTextareaBtn = document.getElementById('save-textarea-btn');

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');

    // Settings elements
    const styleSelect = document.getElementById('style');
    const qualitySelect = document.getElementById('quality');
    const lightingSelect = document.getElementById('lighting');
    const colorSelect = document.getElementById('color');
    const compositionSelect = document.getElementById('composition');
    const seedInput = document.getElementById('seed');
    const hdCheckbox = document.getElementById('hd');
    const enhanceDetailsCheckbox = document.getElementById('enhance-details');
    const safeFilterCheckbox = document.getElementById('safe-filter');
    
    // Add these elements to the existing list
const analyzeImageBtn = document.getElementById('analyze-image-btn');
const imageAnalysisModal = document.getElementById('image-analysis-modal');
const closeAnalysisModal = document.getElementById('close-analysis-modal');
const uploadTrigger = document.getElementById('upload-trigger');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const analyzeBtn = document.getElementById('analyze-btn');
const cancelAnalysisBtn = document.getElementById('cancel-analysis-btn');
const analysisResult = document.getElementById('analysis-result');
const analysisLoading = document.querySelector('.analysis-loading');


// Add these event listeners
// Perbarui event listener untuk modal di ruangriung.js
analyzeImageBtn.addEventListener('click', () => {
    imageAnalysisModal.style.display = 'flex';
    
    // Di mobile, scroll ke modal setelah ditampilkan
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            imageAnalysisModal.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' // Scroll ke awal modal
            });
        }, 50);
    }
});

imageAnalysisModal.addEventListener('click', function(e) {
    if (e.target === imageAnalysisModal) {
        // Di mobile, scroll ke prompt textarea setelah modal ditutup
        if (window.innerWidth <= 768) {
            promptTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        imageAnalysisModal.style.display = 'none';
    }
});

// Tambahkan event listener untuk mencegah closing ketika scroll di dalam modal
imageAnalysisModal.addEventListener('touchmove', function(e) {
    if (this.querySelector('.modal-content').scrollHeight > this.querySelector('.modal-content').clientHeight) {
        e.stopPropagation();
    }
}, { passive: false });

closeAnalysisModal.addEventListener('click', () => {
    imageAnalysisModal.style.display = 'none';
});

cancelAnalysisBtn.addEventListener('click', () => {
    imageAnalysisModal.style.display = 'none';
});

imageAnalysisModal.addEventListener('click', (e) => {
    if (e.target === imageAnalysisModal) {
        imageAnalysisModal.style.display = 'none';
    }
});

uploadTrigger.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

// Update event listener for analyze button
analyzeBtn.addEventListener('click', () => {
    // Coin check
    if (window.canGenerateImage && !window.canGenerateImage()) {
        showError(currentLanguage === 'en' 
            ? 'You have no coins left. Coins will reset in 24 hours.' 
            : 'Koin Anda sudah habis. Koin akan direset dalam 24 jam.');
        return;
    }
    
    function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    const newReader = new FileReader();
                    newReader.onload = (e) => resolve(e.target.result);
                    newReader.readAsDataURL(blob);
                }, 'image/jpeg', quality);
            };
        };
        reader.readAsDataURL(file);
    });
}

// Update image upload handler
imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        // Compress image before displaying
        const compressedImage = await compressImage(file);
        imagePreview.src = compressedImage;
        imagePreview.style.display = 'block';
        analyzeBtn.disabled = false;
    }
});
    
    analyzeImage();
});

// Add this function to analyze the image
async function analyzeImage() {
    if (!imagePreview.src) return;
    
    // Coin check
if (window.canGenerateImage && !window.canGenerateImage()) {
    showError(currentLanguage === 'en' 
        ? 'You have no coins left. Coins will reset in 24 hours.' 
        : 'Koin Anda sudah habis. Koin akan direset dalam 24 jam.');
    return;
}

// Spend coin
if (window.spendCoin && !window.spendCoin()) {
    showError(currentLanguage === 'en' 
        ? 'Failed to spend coin. Please try again.' 
        : 'Gagal menggunakan koin. Silakan coba lagi.');
    return;
}
    
    // Hide previous result and show loading
    analysisResult.textContent = '';
    analysisLoading.style.display = 'block';
    analyzeBtn.disabled = true;
    
    try {
        // Convert image to base64
        const base64Image = imagePreview.src.split(',')[1];
        
        // Prepare messages for OpenAI with image
        const messages = [
            {
                role: "system",
                content: "You are an expert at analyzing images. Describe the image in detail, including objects, colors, style, composition, and any text present. Be thorough and precise."
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Please analyze this image and describe it in detail."
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`
                        }
                    }
                ]
            }
        ];
        
        let fullDescription = "";
        
        // Call the streaming API
        await streamChatCompletion(
            messages,
            { 
                model: "openai",
                seed: Math.floor(Math.random() * 1000000)
            },
            (textChunk) => {
                fullDescription += textChunk;
                analysisResult.innerHTML = `
                    <h4>${translations[currentLanguage].analysisResult}:</h4>
                    <p>${fullDescription}</p>
                    <button class="btn btn-secondary" id="use-as-prompt-btn">
                        <i class="fas fa-magic-wand-sparkles"></i> ${translations[currentLanguage].useAsPrompt}
                    </button>
                `;
                
                // Scroll to bottom of result
                analysisResult.scrollTop = analysisResult.scrollHeight;
            }
        );
        
        // Add event listener for the use as prompt button
        document.getElementById('use-as-prompt-btn').addEventListener('click', () => {
            promptTextarea.value = fullDescription;
            imageAnalysisModal.style.display = 'none';
        });
        
    } catch (error) {
        console.error('Error analyzing image:', error);
        analysisResult.innerHTML = `
            <h4>Error</h4>
            <p>${translations[currentLanguage].failedToAnalyze}</p>
        `;
    } finally {
        analysisLoading.style.display = 'none';
        analyzeBtn.disabled = false;
    }
}
    
    // History array
    let generationHistory = JSON.parse(localStorage.getItem('generationHistory')) || [];
    let savedPrompts = JSON.parse(localStorage.getItem('savedPrompts')) || [];
    
    // Current generation state
    let currentGeneration = {
        prompt: '',
        seed: null,
        model: '',
        settings: {}
    };

    // Filter state
    let currentFilters = {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0
    };
    
    // Default prompts in case AI generation fails
    const defaultPrompts = [
        "A majestic lion in the savannah at sunset, ultra detailed, cinematic lighting, 8k",
        "Cyberpunk cityscape at night with neon lights, rain-soaked streets, futuristic vehicles, 8k ultra detailed",
        "Portrait of a beautiful elf with intricate jewelry, fantasy art, highly detailed, digital painting",
        "Cute anime girl with pink hair in a cherry blossom garden, Studio Ghibli style",
        "Futuristic spaceship orbiting a gas giant, sci-fi, hyperrealistic, 8k"
    ];
    
    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    }
    
    // Check for saved language preference
    let currentLanguage = localStorage.getItem('language') || 'en';
    updateLanguage(currentLanguage);
    
    // Initialize
    updateHistoryPanel();
    updateSavedPromptsPanel();
    updateSliderFill();
    updateDimensionSliders();
    generatePromptSuggestions();
    applyFilters();

    // Event listeners
    generateBtn.addEventListener('click', generateImage);
    enhanceBtn.addEventListener('click', enhancePrompt);
    promptTextarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateImage();
        }
    });
    
    downloadBtn.addEventListener('click', downloadImage);
    shareBtn.addEventListener('click', shareImage);
    remixBtn.addEventListener('click', remixImage);
    variationBtn.addEventListener('click', generateVariation);
    savePromptBtn.addEventListener('click', savePrompt);
    advancedToggle.addEventListener('click', toggleAdvanced);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    widthSlider.addEventListener('input', updateDimensionSliders);
    heightSlider.addEventListener('input', updateDimensionSliders);
    resetHistoryBtn.addEventListener('click', resetHistory);
    clearBtn.addEventListener('click', clearPrompt);
    batchGenerateBtn.addEventListener('click', generateBatch);
    modelNotesToggle.addEventListener('click', toggleModelNotes);
    refreshSuggestionsBtn.addEventListener('click', generatePromptSuggestions);
    
    // Filter controls
    filterToggleBtn.addEventListener('click', toggleFilters);
    enhanceToggleBtn.addEventListener('click', toggleEnhancePanel);
    brightnessFilter.addEventListener('input', updateFilters);
    contrastFilter.addEventListener('input', updateFilters);
    saturationFilter.addEventListener('input', updateFilters);
    blurFilter.addEventListener('input', updateFilters);
    
    // Filter presets
    filterPresets.forEach(preset => {
        preset.addEventListener('click', applyFilterPreset);
    });
    
    // Enhance options
    enhanceOptions.forEach(option => {
        option.addEventListener('click', applyEnhancement);
    });
    
    // Textarea expansion events
    expandTextareaBtn.addEventListener('click', function() {
        fullscreenTextarea.value = promptTextarea.value;
        textareaModal.style.display = 'flex';
        fullscreenTextarea.focus();
    });

    closeTextareaModal.addEventListener('click', function() {
        promptTextarea.value = fullscreenTextarea.value;
        textareaModal.style.display = 'none';
    });

    saveTextareaBtn.addEventListener('click', function() {
        promptTextarea.value = fullscreenTextarea.value;
        textareaModal.style.display = 'none';
    });

    textareaModal.addEventListener('click', function(e) {
        if (e.target === textareaModal) {
            promptTextarea.value = fullscreenTextarea.value;
            textareaModal.style.display = 'none';
        }
    });

    fullscreenTextarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            promptTextarea.value = fullscreenTextarea.value;
            textareaModal.style.display = 'none';
            generateImage();
        }
    });

    // Language toggle event listeners
    langEn.addEventListener('click', function() {
        if (currentLanguage !== 'en') {
            currentLanguage = 'en';
            localStorage.setItem('language', 'en');
            updateLanguage('en');
        }
    });
    
    langId.addEventListener('click', function() {
        if (currentLanguage !== 'id') {
            currentLanguage = 'id';
            localStorage.setItem('language', 'id');
            updateLanguage('id');
        }
    });
    
    // Update slider fill for dimension sliders and filter sliders
    widthSlider.addEventListener('input', updateSliderFill);
    heightSlider.addEventListener('input', updateSliderFill);
    brightnessFilter.addEventListener('input', updateSliderFill);
    contrastFilter.addEventListener('input', updateSliderFill);
    saturationFilter.addEventListener('input', updateSliderFill);
    blurFilter.addEventListener('input', updateSliderFill);
    
    // Reset all settings button
    document.getElementById('reset-all-btn').addEventListener('click', resetAllSettings);

    // Back to top button events
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
            setTimeout(() => backToTopBtn.classList.add('pulse'), 500);
        } else {
            backToTopBtn.classList.remove('visible', 'pulse');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        backToTopBtn.classList.remove('pulse');
    });

    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('pulse');
            }
        }, 1000);
    });

    // Function to update language
    function updateLanguage(lang) {
        const coinResetBtn = document.querySelector('.coin-reset-btn');
        if (coinResetBtn) {
            coinResetBtn.title = lang === 'en' ? 'Reset coins (admin only)' : 'Reset koin (hanya admin)';
        }
        
        if (window.updateResetTimer) {
            window.updateResetTimer();
        }
        
        const t = translations[lang];
        
        // Update UI elements
        document.querySelector('h1').innerHTML = `<i class="fas fa-magic-wand-sparkles"></i> ${t.title}`;
        document.querySelector('.subtitle').textContent = t.subtitle;
        darkModeToggle.querySelector('span').textContent = darkMode ? t.lightMode : t.darkMode;
        promptTextarea.placeholder = t.promptPlaceholder;
        enhanceBtn.innerHTML = `<i class="fas fa-brain"></i> ${t.enhanceBtn}`;
        generateBtn.innerHTML = `<i class="fas fa-magic-wand-sparkles"></i> ${t.generateBtn}`;
        document.querySelector('label[for="batch-count"]').innerHTML = `<i class="fas fa-copy"></i> ${t.batchCount}`;
        batchGenerateBtn.innerHTML = `<i class="fas fa-layer-group"></i> ${t.batchGenerate}`;
        document.querySelector('.batch-controls .note').textContent = t.batchNote;
        document.querySelector('label[for="model"]').innerHTML = `<i class="fas fa-microchip"></i> ${t.aiModel}`;
        document.querySelector('label[for="style"]').innerHTML = `<i class="fas fa-paint-brush"></i> ${t.artStyle}`;
        document.querySelector('label[for="quality"]').innerHTML = `<i class="fas fa-star"></i> ${t.quality}`;
        advancedToggle.querySelector('span').innerHTML = `<i class="fas fa-cogs"></i> ${t.advancedSettings}`;
        document.querySelector('label[for="lighting"]').innerHTML = `<i class="fas fa-lightbulb"></i> ${t.lighting}`;
        document.querySelector('label[for="color"]').innerHTML = `<i class="fas fa-palette"></i> ${t.colorPalette}`;
        document.querySelector('label[for="composition"]').innerHTML = `<i class="fas fa-th-large"></i> ${t.composition}`;
        document.querySelector('label[for="seed"]').innerHTML = `<i class="fas fa-seedling"></i> ${t.seed}`;
        document.querySelector('label[for="hd"]').innerHTML = `<i class="fas fa-expand"></i> ${t.hd}`;
        document.querySelector('label[for="safe-filter"]').innerHTML = `<i class="fas fa-shield-alt"></i> ${t.safeFilter}`;
        document.querySelector('label[for="enhance-details"]').innerHTML = `<i class="fas fa-search-plus"></i> ${t.enhanceDetails}`;
        loadingText.textContent = t.loadingText;
        document.querySelector('.download-text').textContent = t.download;
        document.querySelector('.share-text').textContent = t.share;
        document.querySelector('.remix-text').textContent = t.remix;
        document.querySelector('.variation-text').textContent = t.variation;
        document.querySelector('.save-text').textContent = t.savePrompt;
        document.querySelector('.history-text').textContent = t.history;
        document.querySelector('.clear-history-text').textContent = t.clearHistory;
        document.querySelector('.saved-prompts-text').textContent = t.savedPrompts;
        document.querySelector('.reset-all-text').textContent = t.resetAll;
        document.querySelector('.note').innerHTML = `<i class="fas fa-circle-info"></i> ${t.englishNote}`;
        clearBtn.innerHTML = `<i class="fas fa-trash"></i> ${t.clear}`;
        modelNotesToggle.querySelector('span').innerHTML = `<i class="fas fa-info-circle"></i> ${t.modelNotes}`;
        filterToggleBtn.querySelector('span').textContent = t.filters;
        enhanceToggleBtn.querySelector('span').textContent = t.aiEnhance;
        
        // Add these lines to the updateLanguage function
analyzeImageBtn.innerHTML = `<i class="fas fa-image"></i> ${t.analyzeImage}`;
document.querySelector('#image-analysis-modal .modal-title').innerHTML = `<i class="fas fa-image"></i> ${t.imageAnalysis}`;
uploadTrigger.innerHTML = `<i class="fas fa-upload"></i> ${t.uploadImage}`;
document.querySelector('.analysis-loading p').textContent = t.analyzingImage;
        
        // Update model notes content
        const notesContent = modelNotesContent.querySelectorAll('.note');
        t.modelNotesContent.forEach((note, index) => {
            if (notesContent[index]) {
                notesContent[index].innerHTML = note;
            }
        });
        
        // Update enhance options
        if (enhanceOptions.length >= 5) {
            enhanceOptions[0].textContent = t.enhanceFaces;
            enhanceOptions[1].textContent = t.enhanceBackground;
            enhanceOptions[2].textContent = t.increaseSharpness;
            enhanceOptions[3].textContent = t.colorCorrection;
            enhanceOptions[4].textContent = t.reduceNoise;
        }
        
        // Update language toggle active state
        if (lang === 'en') {
            langEn.classList.add('active');
            langId.classList.remove('active');
        } else {
            langEn.classList.remove('active');
            langId.classList.add('active');
        }
    }

    // Function to generate AI-powered prompt suggestions
    async function generatePromptSuggestions() {
        promptSuggestionsContainer.innerHTML = '';
        suggestionsLoading.style.display = 'flex';
        
        try {
            // System message to guide the AI
            const systemMessage = {
                role: "system",
                content: "You are a creative AI prompt generator. Generate 3 diverse, creative, and detailed prompts for AI image generation. " +
                         "Each prompt should be for a different category (fantasy, sci-fi, realism, surealism, anime, ghibli etc). " +
                         "Format the response with each prompt on a new line, prefixed with '1. ', '2. ', etc. " +
                         "Each prompt should be 1-2 sentences long and include details about style, lighting, shot and composition."
            };
            
            let fullResponse = "";
            
            // Call the streaming API
            await streamChatCompletion(
                [systemMessage],
                { 
                    model: "openai",
                    seed: Math.floor(Math.random() * 1000000)
                },
                (textChunk) => {
                    fullResponse += textChunk;
                }
            );
            
            // Process the response to extract prompts
            const prompts = fullResponse.split('\n')
                .map(line => line.replace(/^\d+\.\s*/, '').trim())
                .filter(line => line.length > 0)
                .slice(0, 5); // Take up to 5 prompts
            
            // Display the prompts as clickable buttons
            displayPromptSuggestions(prompts);
            
        } catch (error) {
            console.error('Error generating prompt suggestions:', error);
            // Fallback to default prompts if AI fails
            displayPromptSuggestions(defaultPrompts);
        } finally {
            suggestionsLoading.style.display = 'none';
        }
    }
    
    // Function to display prompt suggestions
    function displayPromptSuggestions(prompts) {
        promptSuggestionsContainer.innerHTML = '';
        
        prompts.forEach((prompt, index) => {
            const button = document.createElement('button');
            button.className = 'prompt-suggestion';
            button.innerHTML = `<i class="fas fa-lightbulb"></i> ${currentLanguage === 'en' ? 'Suggestion' : 'Saran'} ${index + 1}`;
            button.setAttribute('data-prompt', prompt);
            
            button.addEventListener('click', function() {
                promptTextarea.value = prompt;
                promptTextarea.focus();
            });
            
            promptSuggestionsContainer.appendChild(button);
        });
    }

    // Stream chat completion function for prompt suggestions
    async function streamChatCompletion(messages, options = {}, onChunkReceived) {
        const url = "https://text.pollinations.ai/openai";
        const payload = {
            model: options.model || "openai",
            messages: messages,
            seed: options.seed,
            stream: true,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "text/event-stream",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorText}`
                );
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Process buffer line by line (SSE format: data: {...}\n\n)
                const lines = buffer.split("\n\n");
                buffer = lines.pop(); // Keep the potentially incomplete last line

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const dataStr = line.substring(6).trim();
                        if (dataStr === "[DONE]") continue;
                        
                        try {
                            const chunk = JSON.parse(dataStr);
                            const content = chunk?.choices?.[0]?.delta?.content;
                            if (content && onChunkReceived) {
                                onChunkReceived(content);
                            }
                        } catch (e) {
                            console.error("Failed to parse stream chunk:", dataStr, e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error during streaming chat completion:", error);
            throw error;
        }
    }

    function updateDimensionSliders() {
        const width = parseInt(widthSlider.value);
        const height = parseInt(heightSlider.value);
        
        widthValue.textContent = width;
        heightValue.textContent = height;
        
        // Calculate aspect ratio
        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const ratio = gcd(width, height);
        const aspectRatio = `${width/ratio}:${height/ratio}`;
        
        aspectRatioDisplay.textContent = `${translations[currentLanguage].aspectRatio} ${aspectRatio}`;
        
        // Update slider fill
        updateSliderFill();
    }
    
    async function generateImage() {
        // Coin check
        if (window.canGenerateImage && !window.canGenerateImage()) {
            showError(currentLanguage === 'en' 
                ? 'You have no coins left. Coins will reset in 24 hours.' 
                : 'Koin Anda sudah habis. Koin akan direset dalam 24 jam.');
            return;
        }

        const prompt = promptTextarea.value.trim();
        if (!prompt) {
            showError(currentLanguage === 'en' 
                ? 'Please enter a description for the image' 
                : 'Silakan masukkan deskripsi untuk gambar');
            return;
        }

        // Spend coin
        if (window.spendCoin && !window.spendCoin()) {
            showError(currentLanguage === 'en' 
                ? 'Failed to spend coin. Please try again.' 
                : 'Gagal menggunakan koin. Silakan coba lagi.');
            return;
        }

        // Rest of your existing generateImage code...
        scrollToImageContainer();
        generatedImage.style.display = 'none';

        
        // Hide previous image and error, show loading
        generatedImage.style.display = 'none';
        document.querySelectorAll('.btn').forEach(btn => btn.style.display = 'none');
        errorMessage.style.display = 'none';
        loadingElement.style.display = 'block';
        filterControls.style.display = 'none';
        aiEnhancePanel.style.display = 'none';
        
        // Build the prompt with additional parameters
        let fullPrompt = buildFullPrompt(prompt);
        
        // Store current generation state
        currentGeneration = {
            prompt: fullPrompt,
            seed: seedInput.value || Math.floor(Math.random() * 1000000),
            model: modelSelect.value,
            settings: {
                width: widthSlider.value,
                height: heightSlider.value,
                style: styleSelect.value,
                quality: qualitySelect.value,
                lighting: lightingSelect.value,
                color: colorSelect.value,
                composition: compositionSelect.value,
                hd: hdCheckbox.checked,
                enhanceDetails: enhanceDetailsCheckbox.checked,
                safeFilter: safeFilterCheckbox.checked
            }
        };
        
        try {
            const imageUrl = await AIModelManager.generateImage(fullPrompt, currentGeneration.settings);
            
            if (!imageUrl) {
                // API key not validated, already handled
                loadingElement.style.display = 'none';
                return;
            }
            
            // Load the image
            generatedImage.onload = function() {
                loadingElement.style.display = 'none';
                generatedImage.style.display = 'block';
                document.querySelectorAll('.btn').forEach(btn => btn.style.display = 'flex');
                
                // Update image info
                updateImageInfo();
                
                // Scroll to image container again after image loads
                scrollToImageContainer();
                
                // Add to history only if this is a new generation, not from history click
                if (!generatedImage.dataset.fromHistory) {
                    addToHistory(fullPrompt, imageUrl);
                } else {
                    delete generatedImage.dataset.fromHistory;
                }
            };
            
            generatedImage.onerror = function() {
                loadingElement.style.display = 'none';
                showError(currentLanguage === 'en' ? 'Failed to generate image. Please try a different prompt.' : 'Gagal menghasilkan gambar. Silakan coba dengan deskripsi yang berbeda.');
            };
            
            generatedImage.src = imageUrl;
        } catch (error) {
            console.error('Error generating image:', error);
            loadingElement.style.display = 'none';
            showError(error.message || (currentLanguage === 'en' ? 'Failed to generate image. Please try again.' : 'Gagal menghasilkan gambar. Silakan coba lagi.'));
        }
    }

    function scrollToImageContainer() {
        const imageContainer = document.getElementById('generated-image-container');
        if (imageContainer) {
            imageContainer.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
    
    function buildFullPrompt(basePrompt) {
        let fullPrompt = basePrompt;
        
        // Add style if selected
        if (styleSelect.value) {
            fullPrompt += `, ${styleSelect.value}`;
        }
        
        // Add lighting
        if (lightingSelect.value) {
            fullPrompt += `, ${lightingSelect.value} lighting`;
        }
        
        // Add color palette
        if (colorSelect.value) {
            fullPrompt += `, ${colorSelect.value} colors`;
        }
        
        // Add composition
        if (compositionSelect.value) {
            fullPrompt += `, ${compositionSelect.value}`;
        }
        
        // Add quality
        if (qualitySelect.value !== 'normal') {
            fullPrompt += `, ${qualitySelect.value} quality`;
        }
        
        // Add HD if checked
        if (hdCheckbox.checked) {
            fullPrompt += `, ultra HD`;
        }
        
        // Add detail enhancement if checked
        if (enhanceDetailsCheckbox.checked) {
            fullPrompt += `, highly detailed`;
        }
        
        return fullPrompt;
    }
    
    async function generateBatch() {
        const prompt = promptTextarea.value.trim();
        const batchCount = parseInt(batchCountInput.value);
        
        if (!prompt) {
            showError(currentLanguage === 'en' ? 'Please enter a description for the image' : 'Silakan masukkan deskripsi untuk gambar');
            return;
        }
        
        if (isNaN(batchCount) || batchCount < 1 || batchCount > 10) {
            showError(currentLanguage === 'en' ? 'Please enter a valid batch count between 1 and 10' : 'Masukkan jumlah batch yang valid antara 1 dan 10');
            return;
        }
        
        // Scroll to image container before generation starts
        scrollToImageContainer();
        
        // Store original seed
        const originalSeed = seedInput.value || Math.floor(Math.random() * 1000000);
        
        // Disable buttons during batch generation
        generateBtn.disabled = true;
        batchGenerateBtn.disabled = true;
        batchGenerateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${currentLanguage === 'en' ? 'Generating...' : 'Memproses...'}`;
        
        try {
            // Create a container for batch images if it doesn't exist
            let batchContainer = document.getElementById('batch-images-container');
            if (!batchContainer) {
                batchContainer = document.createElement('div');
                batchContainer.id = 'batch-images-container';
                batchContainer.className = 'batch-images-container';
                document.querySelector('.image-container').insertBefore(batchContainer, document.querySelector('.action-buttons'));
            } else {
                batchContainer.innerHTML = '';
            }
            
            // Generate multiple images
            for (let i = 0; i < batchCount; i++) {
                // Use different seeds for each image
                seedInput.value = originalSeed + i;
                
                // Generate the image
                const imageUrl = generateWithPollinations(prompt);
                
                // Create image element
                const img = document.createElement('img');
                img.src = imageUrl;
                img.className = 'batch-image';
                img.alt = `${currentLanguage === 'en' ? 'Batch image' : 'Gambar batch'} ${i+1}`;
                
                // Add download functionality
                img.addEventListener('click', function() {
                    generatedImage.src = this.src;
                    generatedImage.style.display = 'block';
                    document.querySelectorAll('.btn').forEach(btn => btn.style.display = 'flex');
                    updateImageInfo();
                });
                
                batchContainer.appendChild(img);
                
                // Add to history
                addToHistory(prompt, imageUrl);
            }
            
            // Hide the main generated image during batch view
            generatedImage.style.display = 'none';
            document.querySelectorAll('.btn').forEach(btn => btn.style.display = 'none');
            
        } catch (error) {
            console.error('Error generating batch:', error);
            showError(error.message || (currentLanguage === 'en' ? 'Failed to generate batch. Please try again.' : 'Gagal menghasilkan batch. Silakan coba lagi.'));
        } finally {
            // Restore original seed
            seedInput.value = originalSeed;
            
            // Re-enable buttons
            generateBtn.disabled = false;
            batchGenerateBtn.disabled = false;
            batchGenerateBtn.innerHTML = `<i class="fas fa-layer-group"></i> ${translations[currentLanguage].batchGenerate}`;
        }
    }
    
async function generateVariation() {
    // Tambahkan pengecekan coin di awal
    if (window.canGenerateImage && !window.canGenerateImage()) {
        showError(currentLanguage === 'en' 
            ? 'You have no coins left. Coins will reset in 24 hours.' 
            : 'Koin Anda sudah habis. Koin akan direset dalam 24 jam.');
        return;
    }

    // Spend 1 coin saat klik Variant
    if (window.spendCoin && !window.spendCoin()) {
        showError(currentLanguage === 'en' 
            ? 'Failed to spend coin. Please try again.' 
            : 'Gagal menggunakan koin. Silakan coba lagi.');
        return;
    }

    if (!currentGeneration.prompt || !generatedImage.src) {
        showError(currentLanguage === 'en' ? 'Please generate an image first before creating variations' : 'Harap hasilkan gambar terlebih dahulu sebelum membuat variasi');
        return;
    }
        
        // Scroll to image container before generation starts
        scrollToImageContainer();
        
        // Generate a new seed for the variation
        const newSeed = Math.floor(Math.random() * 1000000);
        seedInput.value = newSeed;
        
        // Update current generation state with new seed
        currentGeneration.seed = newSeed;
        
        // Hide previous image and error, show loading
        generatedImage.style.display = 'none';
        document.querySelectorAll('.btn').forEach(btn => btn.style.display = 'none');
        errorMessage.style.display = 'none';
        loadingElement.style.display = 'block';
        filterControls.style.display = 'none';
        aiEnhancePanel.style.display = 'none';
        
        try {
            const imageUrl = generateWithPollinations(currentGeneration.prompt);
            
            // Load the image
            generatedImage.onload = function() {
                loadingElement.style.display = 'none';
                generatedImage.style.display = 'block';
                document.querySelectorAll('.btn').forEach(btn => btn.style.display = 'flex');
                
                // Update image info
                updateImageInfo();
                
                // Scroll to image container again after image loads
                scrollToImageContainer();
                
                // Add to history
                addToHistory(currentGeneration.prompt, imageUrl);
            };
            
            generatedImage.onerror = function() {
                loadingElement.style.display = 'none';
                showError(currentLanguage === 'en' ? 'Failed to generate variation. Please try again.' : 'Gagal menghasilkan variasi. Silakan coba lagi.');
            };
            
            generatedImage.src = imageUrl;
        } catch (error) {
            console.error('Error generating variation:', error);
            loadingElement.style.display = 'none';
            showError(error.message || (currentLanguage === 'en' ? 'Failed to generate variation. Please try again.' : 'Gagal menghasilkan variasi. Silakan coba lagi.'));
        }
    }
    
    function generateWithPollinations(prompt) {
        // Get dimensions from sliders
        const width = widthSlider.value;
        const height = heightSlider.value;
        const safeFilter = safeFilterCheckbox.checked;
        let ratioParam = `?width=${width}&height=${height}&nologo=true&safe=${safeFilter}`;
        
        // Add seed if provided
        if (currentGeneration.seed) {
            ratioParam += `&seed=${currentGeneration.seed}`;
        }
        
        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(prompt);
        
        // Generate the image URL
        return `https://image.pollinations.ai/prompt/${encodedPrompt}${ratioParam}`;
    }
    
    async function enhancePrompt() {
        const prompt = promptTextarea.value.trim();
        
        if (!prompt) {
            showError(currentLanguage === 'en' ? 'Please enter a description to enhance' : 'Silakan masukkan deskripsi untuk ditingkatkan');
            return;
        }
        
        // Show loading state
        const originalButtonHTML = enhanceBtn.innerHTML;
        enhanceBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${currentLanguage === 'en' ? 'Enhancing...' : 'Meningkatkan...'}`;
        enhanceBtn.disabled = true;
        
        // Store original prompt
        const originalPrompt = promptTextarea.value;
        
        try {
            // Create messages array for the API
            const messages = [
                { 
                    role: "system", 
                    content: "You are a prompt enhancement assistant. Improve the following AI image generation prompt while maintaining its original intent. Add relevant details about style, composition, lighting, and quality where appropriate. Return only the enhanced prompt, no additional commentary."
                },
                { 
                    role: "user", 
                    content: prompt 
                }
            ];
            
            // Clear the textarea for streaming
            promptTextarea.value = "";
            
            // Call the streaming API
            await streamChatCompletion(
                messages, 
                { 
                    model: "openai",
                    seed: Math.floor(Math.random() * 1000000)
                },
                (textChunk) => {
                    // Append each chunk to the textarea
                    promptTextarea.value += textChunk;
                    // Auto-scroll to bottom
                    promptTextarea.scrollTop = promptTextarea.scrollHeight;
                }
            );
            
        } catch (error) {
            console.error('Error enhancing prompt:', error);
            // Restore original prompt if error occurs
            promptTextarea.value = originalPrompt;
            showError(currentLanguage === 'en' ? 'Failed to enhance prompt. Please try again.' : 'Gagal meningkatkan prompt. Silakan coba lagi.');
        } finally {
            // Restore button state
            enhanceBtn.innerHTML = originalButtonHTML;
            enhanceBtn.disabled = false;
        }
    }
    
    function downloadImage() {
        if (!generatedImage.src) {
            showError(currentLanguage === 'en' ? 'No image to download' : 'Tidak ada gambar untuk diunduh');
            return;
        }
        
        // Create a temporary canvas to handle different image types
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Handle CORS for external images
        img.crossOrigin = 'Anonymous';
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply filters before downloading
            ctx.filter = getCurrentFilterCSS();
            ctx.drawImage(img, 0, 0);
            
            // Create download link
            const link = document.createElement('a');
            const prompt = promptTextarea.value.trim().substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.download = `ai-art-${prompt || 'generated'}-${Date.now()}.png`;
            
            // Convert canvas to blob and trigger download
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                link.href = url;
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 100);
            }, 'image/png');
        };
        
        img.onerror = function() {
            showError(currentLanguage === 'en' ? 'Failed to process image for download' : 'Gagal memproses gambar untuk diunduh');
        };
        
        img.src = generatedImage.src;
    }
    
    function shareImage() {
        if (!generatedImage.src) {
            showError(currentLanguage === 'en' ? 'No image to share' : 'Tidak ada gambar untuk dibagikan');
            return;
        }
        
        if (navigator.share) {
            navigator.share({
                title: currentLanguage === 'en' ? 'AI Generated Art' : 'Seni Hasil AI',
                text: currentLanguage === 'en' ? 'Check out this image I created with AI: ' : 'Lihat gambar yang saya buat dengan AI: ' + promptTextarea.value.trim(),
                url: generatedImage.src
            }).catch(err => {
                console.error('Error sharing:', err);
                copyToClipboard(generatedImage.src);
            });
        } else {
            copyToClipboard(generatedImage.src);
        }
    }
    
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        showSweetAlert(
            currentLanguage === 'en' ? 'Copied' : 'Disalin',
            currentLanguage === 'en' ? 'Image URL copied to clipboard!' : 'URL gambar disalin ke clipboard!',
            'success'
        );
    }
    
    function remixImage() {
        if (!generatedImage.src) {
            showError(currentLanguage === 'en' ? 'No image to remix' : 'Tidak ada gambar untuk di-remix');
            return;
        }
        
        // Add some randomness to the prompt
        const currentPrompt = promptTextarea.value.trim();
        const modifiers = currentLanguage === 'en' ? [
            'in a different style',
            'with a new color scheme',
            'from a different angle',
            'with dramatic lighting',
            'as a surreal interpretation',
            'in a fantasy version'
        ] : [
            'dalam gaya yang berbeda',
            'dengan skema warna baru',
            'dari sudut yang berbeda',
            'dengan pencahayaan dramatis',
            'sebagai interpretasi surealis',
            'dalam versi fantasi'
        ];
        
        const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        promptTextarea.value = currentPrompt + ', ' + randomModifier;
        
        // Generate new image
        generateImage();
    }
    
    function savePrompt() {
        const prompt = promptTextarea.value.trim();
        if (!prompt) {
            showSweetAlert(
                currentLanguage === 'en' ? 'Error' : 'Kesalahan',
                currentLanguage === 'en' ? 'Please enter a prompt to save' : 'Silakan masukkan prompt untuk disimpan',
                'error'
            );
            return;
        }
        
        // Check if prompt already exists
        const existingPrompt = savedPrompts.find(p => p.prompt === prompt);
        if (existingPrompt) {
            showSweetAlert(
                currentLanguage === 'en' ? 'Duplicate' : 'Duplikat',
                currentLanguage === 'en' ? 'This prompt is already saved!' : 'Prompt ini sudah disimpan!',
                'warning'
            );
            return;
        }
        
        const promptItem = {
            prompt: prompt,
            timestamp: new Date().toISOString()
        };
        
        savedPrompts.unshift(promptItem);
        localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
        updateSavedPromptsPanel();
        
        showSweetAlert(
            currentLanguage === 'en' ? 'Success' : 'Berhasil',
            currentLanguage === 'en' ? 'Prompt saved! You can find it in the Saved Prompts section.' : 'Prompt disimpan! Anda dapat menemukannya di bagian Prompt Tersimpan.',
            'success'
        );
    }
    
    function addToHistory(prompt, imageUrl) {
        // Check if this prompt already exists in history
        const existingIndex = generationHistory.findIndex(item => item.prompt === prompt);
        
        if (existingIndex >= 0) {
            // Remove the old entry if it exists
            generationHistory.splice(existingIndex, 1);
        }
        
        const historyItem = {
            prompt: prompt,
            imageUrl: imageUrl,
            timestamp: new Date().toISOString()
        };
        
        generationHistory.unshift(historyItem);
        if (generationHistory.length > 10) {
            generationHistory = generationHistory.slice(0, 10);
        }
        
        localStorage.setItem('generationHistory', JSON.stringify(generationHistory));
        updateHistoryPanel();
    }
    
    function updateHistoryPanel() {
        if (generationHistory.length === 0) {
            historyPanel.style.display = 'none';
            return;
        }
        
        historyPanel.style.display = 'block';
        historyList.innerHTML = '';
        
        generationHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <img src="${item.imageUrl}" alt="Generated image" class="history-thumbnail">
                <div class="history-prompt">${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}</div>
                <div class="history-date">${new Date(item.timestamp).toLocaleDateString()}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                promptTextarea.value = item.prompt;
                generatedImage.dataset.fromHistory = 'true';
                generatedImage.src = item.imageUrl;
                generatedImage.style.display = 'block';
                document.querySelectorAll('.btn').forEach(btn => btn.style.display = 'flex');
                updateImageInfo();
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    function resetHistory() {
        showConfirm(
            currentLanguage === 'en' ? 'Confirm Reset' : 'Konfirmasi Reset',
            currentLanguage === 'en' ? 'Are you sure you want to clear your generation history? This cannot be undone.' : 'Apakah Anda yakin ingin menghapus riwayat generasi? Tindakan ini tidak dapat dibatalkan.',
            currentLanguage === 'en' ? 'Yes, clear it!' : 'Ya, hapus!',
            currentLanguage === 'en' ? 'Cancel' : 'Batal'
        ).then((result) => {
            if (result.isConfirmed) {
                generationHistory = [];
                localStorage.setItem('generationHistory', JSON.stringify(generationHistory));
                updateHistoryPanel();
                showSweetAlert(
                    currentLanguage === 'en' ? 'Cleared' : 'Dihapus',
                    currentLanguage === 'en' ? 'Generation history has been cleared.' : 'Riwayat generasi telah dihapus.',
                    'success'
                );
            }
        });
    }
    
    function updateSavedPromptsPanel() {
        if (savedPrompts.length === 0) {
            savedPromptsPanel.style.display = 'none';
            return;
        }
        
        savedPromptsPanel.style.display = 'block';
        savedPromptsList.innerHTML = '';
        
        savedPrompts.forEach((item, index) => {
            const promptItem = document.createElement('div');
            promptItem.className = 'saved-prompt-item';
            promptItem.innerHTML = `
                <div class="saved-prompt-text">${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}</div>
                <div class="saved-prompt-actions">
                    <i class="fas fa-copy saved-prompt-action" title="${currentLanguage === 'en' ? 'Copy to prompt' : 'Salin ke prompt'}"></i>
                    <i class="fas fa-trash saved-prompt-action" title="${currentLanguage === 'en' ? 'Delete' : 'Hapus'}"></i>
                </div>
            `;
            
            // Add click handler for copy action
            promptItem.querySelector('.fa-copy').addEventListener('click', (e) => {
                e.stopPropagation();
                promptTextarea.value = item.prompt;
                promptTextarea.focus();
            });
            
            // Add click handler for delete action
            promptItem.querySelector('.fa-trash').addEventListener('click', (e) => {
                e.stopPropagation();
                savedPrompts.splice(index, 1);
                localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
                updateSavedPromptsPanel();
            });
            
            // Add click handler to use the prompt
            promptItem.addEventListener('click', () => {
                promptTextarea.value = item.prompt;
            });
            
            savedPromptsList.appendChild(promptItem);
        });
    }
    
    function toggleAdvanced() {
        advancedContent.classList.toggle('show');
        advancedArrow.classList.toggle('fa-chevron-down');
        advancedArrow.classList.toggle('fa-chevron-up');
    }
    
    function toggleModelNotes() {
        modelNotesContent.classList.toggle('show');
        modelNotesArrow.classList.toggle('fa-chevron-down');
        modelNotesArrow.classList.toggle('fa-chevron-up');
    }
    
    function toggleFilters() {
        if (filterControls.style.display === 'block') {
            filterControls.style.display = 'none';
        } else {
            filterControls.style.display = 'block';
            aiEnhancePanel.style.display = 'none';
        }
    }
    
    function toggleEnhancePanel() {
        if (aiEnhancePanel.style.display === 'block') {
            aiEnhancePanel.style.display = 'none';
        } else {
            aiEnhancePanel.style.display = 'block';
            filterControls.style.display = 'none';
        }
    }
    
    // Function to update the slider fill dynamically
    function updateSliderFill() {
        // Update all range inputs
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 100;
            const value = parseFloat(slider.value) || 0;
            const percentage = ((value - min) / (max - min)) * 100;
            
            // Set the width of the ::before pseudo-element
            slider.style.setProperty('--range-percent', `${percentage}%`);
            
            // Apply the dynamic fill using the ::before pseudo-element
            slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--shadow-dark) ${percentage}%, var(--shadow-dark) 100%)`;
        });
    }
    
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            darkModeToggle.innerHTML = `<i class="fas fa-sun"></i><span>${translations[currentLanguage].lightMode}</span>`;
        } else {
            darkModeToggle.innerHTML = `<i class="fas fa-moon"></i><span>${translations[currentLanguage].darkMode}</span>`;
        }
        
        localStorage.setItem('darkMode', isDarkMode);
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        loadingElement.style.display = 'none';
        
        // Show SweetAlert for more prominent error
        showSweetAlert(
            currentLanguage === 'en' ? 'Error' : 'Kesalahan',
            message,
            'error'
        );
    }
    
    function clearPrompt() {
        promptTextarea.value = '';
        promptTextarea.focus();
    }
    
    function resetAllSettings() {
        showConfirm(
            currentLanguage === 'en' ? 'Reset All Settings?' : 'Atur Ulang Semua Pengaturan?',
            currentLanguage === 'en' 
                ? 'Are you sure you want to reset ALL settings? This will clear:\n- Generation history\n- Saved prompts\n- Dark mode preference\n\nThis action cannot be undone.' 
                : 'Apakah Anda yakin ingin mengatur ulang SEMUA pengaturan? Ini akan menghapus:\n- Riwayat generasi\n- Prompt tersimpan\n- Preferensi mode gelap\n\nTindakan ini tidak dapat dibatalkan.',
            currentLanguage === 'en' ? 'Yes, reset all' : 'Ya, atur ulang',
            currentLanguage === 'en' ? 'Cancel' : 'Batal'
        ).then((result) => {
            if (result.isConfirmed) {
                // Clear all localStorage items
                localStorage.removeItem('generationHistory');
                localStorage.removeItem('savedPrompts');
                localStorage.removeItem('darkMode');
                localStorage.removeItem('language');
                
                // Reset state variables
                generationHistory = [];
                savedPrompts = [];
                currentLanguage = 'en';
                
                // Update UI
                updateHistoryPanel();
                updateSavedPromptsPanel();
                updateLanguage('en');
                
                // Reset dark mode to default (light)
                document.body.classList.remove('dark-mode');
                darkModeToggle.innerHTML = `<i class="fas fa-moon"></i><span>${translations.en.darkMode}</span>`;
                
                showSweetAlert(
                    currentLanguage === 'en' ? 'Reset Complete' : 'Pengaturan Ulang Selesai',
                    currentLanguage === 'en' ? 'All settings have been reset to defaults.' : 'Semua pengaturan telah diatur ulang ke default.',
                    'success'
                );
            }
        });
    }

    // Filter functions
    function updateFilters() {
        currentFilters = {
            brightness: parseInt(brightnessFilter.value),
            contrast: parseInt(contrastFilter.value),
            saturation: parseInt(saturationFilter.value),
            blur: parseInt(blurFilter.value)
        };
        
        applyFilters();
        updateSliderFill(); // Update slider fill when filter values change
    }
    
    function applyFilters() {
        generatedImage.style.filter = getCurrentFilterCSS();
    }
    
    function getCurrentFilterCSS() {
        return `brightness(${currentFilters.brightness}%) contrast(${currentFilters.contrast}%) saturate(${currentFilters.saturation}%) blur(${currentFilters.blur}px)`;
    }
    
    function applyFilterPreset() {
        const brightness = this.getAttribute('data-brightness');
        const contrast = this.getAttribute('data-contrast');
        const saturation = this.getAttribute('data-saturation');
        const blur = this.getAttribute('data-blur');
        
        brightnessFilter.value = brightness;
        contrastFilter.value = contrast;
        saturationFilter.value = saturation;
        blurFilter.value = blur;
        
        currentFilters = {
            brightness: parseInt(brightness),
            contrast: parseInt(contrast),
            saturation: parseInt(saturation),
            blur: parseInt(blur)
        };
        
        applyFilters();
        updateSliderFill(); // Update slider fill when applying presets
        
        // Update active state
        filterPresets.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
    }
    
    // AI Enhance functions
    function applyEnhancement() {
        const enhancement = this.getAttribute('data-enhance');
        enhanceProgress.style.display = 'block';
        enhanceProgressBar.style.width = '0%';
        
        // Simulate enhancement progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            enhanceProgressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                enhanceProgress.style.display = 'none';
                
                // Apply the enhancement (simulated)
                let newFilters = {...currentFilters};
                
                switch(enhancement) {
                    case 'face':
                        newFilters.contrast = Math.min(newFilters.contrast + 10, 200);
                        newFilters.brightness = Math.min(newFilters.brightness + 5, 200);
                        break;
                    case 'background':
                        newFilters.saturation = Math.max(newFilters.saturation - 10, 0);
                        newFilters.blur = Math.min(newFilters.blur + 1, 10);
                        break;
                    case 'sharpness':
                        newFilters.contrast = Math.min(newFilters.contrast + 15, 200);
                        break;
                    case 'color':
                        newFilters.saturation = Math.min(newFilters.saturation + 20, 200);
                        break;
                    case 'noise':
                        newFilters.blur = Math.min(newFilters.blur + 1, 10);
                        break;
                }
                
                // Smooth transition to new filter values
                animateFilterTransition(currentFilters, newFilters);
            }
        }, 50);
    }
    
    function animateFilterTransition(startFilters, endFilters) {
        const duration = 500; // ms
        const startTime = performance.now();
        
        function updateFilters(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            currentFilters = {
                brightness: startFilters.brightness + (endFilters.brightness - startFilters.brightness) * progress,
                contrast: startFilters.contrast + (endFilters.contrast - startFilters.contrast) * progress,
                saturation: startFilters.saturation + (endFilters.saturation - startFilters.saturation) * progress,
                blur: startFilters.blur + (endFilters.blur - startFilters.blur) * progress
            };
            
            applyFilters();
            
            // Update slider positions to match current filters
            brightnessFilter.value = currentFilters.brightness;
            contrastFilter.value = currentFilters.contrast;
            saturationFilter.value = currentFilters.saturation;
            blurFilter.value = currentFilters.blur;
            
            // Update slider fill
            updateSliderFill();
            
            if (progress < 1) {
                requestAnimationFrame(updateFilters);
            }
        }
        
        requestAnimationFrame(updateFilters);
    }
    
    // Image info functions
    function updateImageInfo() {
        if (!generatedImage.src) return;
        
        const width = generatedImage.naturalWidth;
        const height = generatedImage.naturalHeight;
        const size = formatFileSize(estimateImageSize(generatedImage.src));
        
        imageInfo.textContent = `${width}×${height} • ${size}`;
    }
    
    function estimateImageSize(url) {
        // This is a rough estimation - actual size may vary
        if (url.includes('image.pollinations.ai')) {
            const width = currentGeneration.settings.width || 1024;
            const height = currentGeneration.settings.height || 1024;
            
            // Estimate ~1 byte per pixel for compressed PNG
            return width * height;
        }
        
        // Default estimate for unknown sources
        return 1024 * 1024; // 1MB
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
});

// Status Indicator
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

function updateStatus(status, message) {
    statusDot.className = 'status-dot';
    
    switch(status) {
        case 'connected':
            statusDot.classList.add('connected');
            statusText.textContent = message || 'Terhubung ke sistem AI';
            break;
        case 'warning':
            statusDot.classList.add('warning');
            statusText.textContent = message || 'Peringatan: Masalah koneksi';
            break;
        case 'error':
            statusDot.classList.add('error');
            statusText.textContent = message || 'Error: Tidak terhubung';
            break;
        default:
            statusText.textContent = message || 'Status tidak diketahui';
    }
    
    logToConsole(`Status sistem diperbarui: ${status} - ${message || ''}`);
}

// Simulate connection status
setTimeout(() => {
    updateStatus('connected', 'Sistem siap digunakan');
}, 1500);

// Cookie Consent Module
const CookieConsent = (function() {
    // Private variables
    const COOKIE_NAME = 'ruangriung_cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;
    const banner = document.getElementById('cookieConsentBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    const declineBtn = document.getElementById('cookieDecline');
    const learnMoreLink = document.getElementById('cookieLearnMore');
    
    // Check if cookie consent is needed
    function shouldShowBanner() {
        return !getCookie(COOKIE_NAME);
    }
    
    // Get cookie value
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    // Set cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }
    
    // Show banner
    function showBanner() {
        if (shouldShowBanner()) {
            banner.classList.add('show');
        }
    }
    
    // Hide banner
    function hideBanner() {
        banner.classList.remove('show');
    }
    
    // Handle accept
    function handleAccept() {
        setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
        hideBanner();
        logToConsole('Cookie consent accepted');
        showSweetAlert(
            'Cookie Consent',
            'Terima kasih telah menerima penggunaan cookie kami. Pengaturan ini akan disimpan untuk kunjungan Anda berikutnya.',
            'success'
        );
    }
    
    // Handle decline
    function handleDecline() {
        setCookie(COOKIE_NAME, 'declined', COOKIE_EXPIRY_DAYS);
        hideBanner();
        logToConsole('Cookie consent declined');
        showSweetAlert(
            'Cookie Consent',
            'Anda telah menolak penggunaan cookie. Beberapa fitur mungkin tidak berfungsi optimal.',
            'info'
        );
    }
    
    // Handle learn more
    function handleLearnMore(e) {
        e.preventDefault();
        showSweetAlert(
            'Cookie Policy',
            'Kebijakan Cookie: Kami menggunakan cookie untuk meningkatkan pengalaman pengguna dan analisis lalu lintas. Anda dapat mengelola preferensi cookie Anda melalui pengaturan browser.',
            'info'
        );
    }
    
    // Initialize
    function init() {
        // Only add event listeners if elements exist
        if (acceptBtn) acceptBtn.addEventListener('click', handleAccept);
        if (declineBtn) declineBtn.addEventListener('click', handleDecline);
        if (learnMoreLink) learnMoreLink.addEventListener('click', handleLearnMore);
        
        // Show banner if needed
        showBanner();
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize Cookie Consent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    CookieConsent.init();
});

// Helper function to log to console
function logToConsole(message) {
    console.log(message);
}

// FAQ Module
const FAQManager = (function() {
    // Private variables
    let faqData = [
        {
            question: "Apa itu RuangRiung AI Image Generator?",
            answer: "RuangRiung AI Image Generator adalah alat yang menggunakan kecerdasan buatan untuk menghasilkan gambar berdasarkan deskripsi teks yang Anda berikan. Anda bisa membuat berbagai jenis gambar dalam berbagai gaya seni hanya dengan menulis deskripsi."
        },
        {
            question: "Bagaimana cara menggunakan generator ini?",
            answer: "Cukup ketik deskripsi gambar yang Anda inginkan di kotak teks, pilih gaya dan pengaturan yang diinginkan, lalu klik tombol 'Generate'. Sistem AI akan membuat gambar berdasarkan input Anda."
        },
        {
            question: "Berapa lama waktu yang dibutuhkan untuk menghasilkan gambar?",
            answer: "Waktu generasi bervariasi tergantung pada kompleksitas gambar dan beban server, biasanya antara 10-30 detik. Gambar yang lebih kompleks atau resolusi lebih tinggi mungkin membutuhkan waktu lebih lama."
        },
        {
            question: "Apakah gambar yang dihasilkan gratis digunakan?",
            answer: "Ya, semua gambar yang dihasilkan oleh alat ini bebas digunakan untuk keperluan pribadi atau komersial. Namun, kami menyarankan untuk memeriksa ketentuan penggunaan dari penyedia model AI untuk kepastian."
        },
        {
            question: "Mengapa gambar saya tidak sesuai dengan yang saya deskripsikan?",
            answer: "Kualitas hasil tergantung pada beberapa faktor termasuk kejelasan deskripsi, pilihan gaya, dan kemampuan model AI. Coba gunakan deskripsi yang lebih detail dan eksperimen dengan berbagai gaya untuk hasil terbaik."
        }
    ];

    // Private methods
    function createFAQItem(faq, index) {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <div class="faq-question">
                <span>${faq.question}</span>
                <i class="fas fa-chevron-down faq-toggle"></i>
            </div>
            <div class="faq-answer">${faq.answer}</div>
        `;
        
        const question = faqItem.querySelector('.faq-question');
        const answer = faqItem.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            faqItem.classList.toggle('active');
            answer.classList.toggle('show');
        });
        
        return faqItem;
    }

    function renderFAQ() {
        const container = document.getElementById('faqContainer');
        if (!container) return;
        
        container.innerHTML = '';
        faqData.forEach((faq, index) => {
            container.appendChild(createFAQItem(faq, index));
        });
    }

    function translateFAQ(language) {
        if (language === 'en') {
            faqData = [
                {
                    question: "What is RuangRiung AI Image Generator?",
                    answer: "RuangRiung AI Image Generator is a tool that uses artificial intelligence to generate images based on text descriptions you provide. You can create various types of images in different art styles just by writing descriptions."
                },
                {
                    question: "How do I use this generator?",
                    answer: "Simply type your image description in the text box, select your desired style and settings, then click the 'Generate' button. The AI system will create an image based on your input."
                },
                {
                    question: "How long does it take to generate an image?",
                    answer: "Generation time varies depending on image complexity and server load, typically between 10-30 seconds. More complex images or higher resolutions may take longer."
                },
                {
                    question: "Can I use the generated images for free?",
                    answer: "Yes, all images generated by this tool are free to use for personal or commercial purposes. However, we recommend checking the terms of use from the AI model provider for certainty."
                },
                {
                    question: "Why doesn't my image match what I described?",
                    answer: "Output quality depends on several factors including description clarity, style selection, and AI model capabilities. Try using more detailed descriptions and experiment with different styles for best results."
                }
            ];
        } else {
            faqData = [
                {
                    question: "Apa itu RuangRiung AI Image Generator?",
                    answer: "RuangRiung AI Image Generator adalah alat yang menggunakan kecerdasan buatan untuk menghasilkan gambar berdasarkan deskripsi teks yang Anda berikan. Anda bisa membuat berbagai jenis gambar dalam berbagai gaya seni hanya dengan menulis deskripsi."
                },
                {
                    question: "Bagaimana cara menggunakan generator ini?",
                    answer: "Cukup ketik deskripsi gambar yang Anda inginkan di kotak teks, pilih gaya dan pengaturan yang diinginkan, lalu klik tombol 'Generate'. Sistem AI akan membuat gambar berdasarkan input Anda."
                },
                {
                    question: "Berapa lama waktu yang dibutuhkan untuk menghasilkan gambar?",
                    answer: "Waktu generasi bervariasi tergantung pada kompleksitas gambar dan beban server, biasanya antara 10-30 detik. Gambar yang lebih kompleks atau resolusi lebih tinggi mungkin membutuhkan waktu lebih lama."
                },
                {
                    question: "Apakah gambar yang dihasilkan gratis digunakan?",
                    answer: "Ya, semua gambar yang dihasilkan oleh alat ini bebas digunakan untuk keperluan pribadi atau komersial. Namun, kami menyarankan untuk memeriksa ketentuan penggunaan dari penyedia model AI untuk kepastian."
                },
                {
                    question: "Mengapa gambar saya tidak sesuai dengan yang saya deskripsikan?",
                    answer: "Kualitas hasil tergantung pada beberapa faktor termasuk kejelasan deskripsi, pilihan gaya, dan kemampuan model AI. Coba gunakan deskripsi yang lebih detail dan eksperimen dengan berbagai gaya untuk hasil terbaik."
                }
            ];
        }
        renderFAQ();
    }

    // Public API
    return {
        init: renderFAQ,
        translate: translateFAQ
    };
})();

// Initialize FAQ when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    FAQManager.init();
    
    // Add language change listener if needed
    const langEn = document.getElementById('lang-en');
    const langId = document.getElementById('lang-id');
    
    if (langEn) {
        langEn.addEventListener('click', () => FAQManager.translate('en'));
    }
    
    if (langId) {
        langId.addEventListener('click', () => FAQManager.translate('id'));
    }
});

// Add these to your DOM element selections
const expandTextareaBtn = document.getElementById('expand-textarea-btn');
const textareaOverlay = document.getElementById('textarea-overlay');
const doneExpandingBtn = document.getElementById('done-expanding-btn');

// Add these event listeners
expandTextareaBtn.addEventListener('click', toggleTextareaExpansion);
textareaOverlay.addEventListener('click', toggleTextareaExpansion);
doneExpandingBtn.addEventListener('click', toggleTextareaExpansion);

function toggleTextareaExpansion() {
    promptTextarea.classList.toggle('expanded');
    textareaOverlay.classList.toggle('visible');
    doneExpandingBtn.classList.toggle('visible');
    expandTextareaBtn.classList.toggle('expanded');
    
    if (promptTextarea.classList.contains('expanded')) {
        // When expanding
        promptTextarea.focus();
        document.body.style.overflow = 'hidden'; // Prevent page scrolling
    } else {
        // When collapsing
        document.body.style.overflow = ''; // Re-enable page scrolling
    }
}

// Auto-resize textarea as user types
promptTextarea.addEventListener('input', function() {
    if (!promptTextarea.classList.contains('expanded')) {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Limit height before suggesting expansion
        if (this.scrollHeight > 200 && !this.classList.contains('expanded')) {
            expandTextareaBtn.style.opacity = '1';
            expandTextareaBtn.style.visibility = 'visible';
        }
    }
});

// Initialize
promptTextarea.style.height = 'auto';
promptTextarea.style.height = (promptTextarea.scrollHeight) + 'px';