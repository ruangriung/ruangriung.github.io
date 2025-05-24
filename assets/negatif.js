// negatif.js - Updated Negative Prompt Implementation for RuangRiung Theme

// Negative prompt translations
const negativePromptTranslations = {
    en: {
        negativePromptLabel: "Negative Prompt",
        negativePromptPlaceholder: "What you don't want in the image (e.g. blurry, deformed, ugly, extra limbs)",
        negativePromptNote: "Describe elements to exclude from the generated image",
        negativePromptToggle: "Show Negative Prompt",
        commonNegativePrompts: [
            "blurry, deformed, ugly, extra limbs",
            "low quality, bad anatomy, distorted face",
            "watermark, text, signature, frame",
            "mutated hands, poorly drawn face",
            "morbid, duplicate, out of frame"
        ]
    },
    id: {
        negativePromptLabel: "Prompt Negatif",
        negativePromptPlaceholder: "Apa yang tidak Anda inginkan dalam gambar (contoh: blur, cacat, jelek, anggota tubuh ekstra)",
        negativePromptNote: "Jelaskan elemen yang ingin dikecualikan dari gambar yang dihasilkan",
        negativePromptToggle: "Tampilkan Prompt Negatif",
        commonNegativePrompts: [
            "blur, cacat, jelek, anggota tubuh ekstra",
            "kualitas rendah, anatomi buruk, wajah terdistorsi",
            "watermark, teks, tanda tangan, bingkai",
            "tangan bermutasi, wajah tergambar buruk",
            "morbid, duplikat, di luar bingkai"
        ]
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Wait for all elements to be ready
    setTimeout(() => {
        initNegativePrompt();
        setupNegativePromptIntegration();
    }, 500);
});

function initNegativePrompt() {
    // Create UI elements if they don't exist
    if (!document.getElementById('negative-prompt-toggle')) {
        createNegativePromptUI();
    }

    // Setup toggle functionality
    const negativeToggle = document.getElementById('negative-prompt-toggle');
    const negativeContainer = document.getElementById('negative-prompt-container');

    if (negativeToggle && negativeContainer) {
        negativeToggle.addEventListener('click', toggleNegativePromptVisibility);
        
        // Initialize textarea autoresize
        const negativeTextarea = document.getElementById('negative-prompt-textarea');
        if (negativeTextarea) {
            setupTextareaAutoresize(negativeTextarea);
        }
    }
}

function createNegativePromptUI() {
    const promptContainer = document.querySelector('.input-group');
    if (!promptContainer) return;

    const negativeHTML = `
        <div class="negative-prompt-section">
            <button id="negative-prompt-toggle" class="negative-prompt-toggle">
                <i class="fas fa-eye-slash"></i> 
                <span class="toggle-text">${negativePromptTranslations[currentLanguage].negativePromptToggle}</span>
            </button>
            <div id="negative-prompt-container" class="negative-prompt-container" style="display: none;">
                <label for="negative-prompt-textarea">
                    <i class="fas fa-ban"></i> 
                    <span class="label-text">${negativePromptTranslations[currentLanguage].negativePromptLabel}</span>
                </label>
                <textarea id="negative-prompt-textarea" class="negative-prompt-textarea" 
                        placeholder="${negativePromptTranslations[currentLanguage].negativePromptPlaceholder}"></textarea>
                <div class="negative-prompt-note">
                    <i class="fas fa-info-circle"></i> 
                    <span class="note-text">${negativePromptTranslations[currentLanguage].negativePromptNote}</span>
                </div>
                <div class="common-negative-prompts"></div>
            </div>
        </div>
    `;

    promptContainer.insertAdjacentHTML('afterend', negativeHTML);
    addCommonNegativePrompts();
}

function toggleNegativePromptVisibility() {
    const negativeContainer = document.getElementById('negative-prompt-container');
    const icon = this.querySelector('i');
    const text = this.querySelector('.toggle-text');
    
    const isHidden = negativeContainer.style.display === 'none';
    
    // Toggle visibility with animation
    negativeContainer.style.display = isHidden ? 'block' : 'none';
    
    // Update icon and text
    if (isHidden) {
        icon.classList.replace('fa-eye-slash', 'fa-eye');
        text.textContent = currentLanguage === 'en' ? 'Hide Negative Prompt' : 'Sembunyikan Prompt Negatif';
        // Add animation class
        negativeContainer.classList.add('animate-fade-in');
        setTimeout(() => {
            negativeContainer.classList.remove('animate-fade-in');
        }, 300);
    } else {
        icon.classList.replace('fa-eye', 'fa-eye-slash');
        text.textContent = negativePromptTranslations[currentLanguage].negativePromptToggle;
    }
    
    // Trigger resize
    setTimeout(() => {
        const textarea = document.getElementById('negative-prompt-textarea');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }, 10);
}

function setupTextareaAutoresize(textarea) {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Initialize height
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

function addCommonNegativePrompts() {
    const container = document.querySelector('.common-negative-prompts');
    if (!container) return;

    container.innerHTML = '';
    
    negativePromptTranslations[currentLanguage].commonNegativePrompts.forEach((prompt, index) => {
        const button = document.createElement('button');
        button.className = 'common-negative-prompt';
        button.innerHTML = `<i class="fas fa-lightbulb"></i> ${currentLanguage === 'en' ? 'Suggestion' : 'Saran'} ${index + 1}`;
        button.setAttribute('data-prompt', prompt);
        button.setAttribute('title', prompt);
        
        button.addEventListener('click', function() {
            const textarea = document.getElementById('negative-prompt-textarea');
            if (textarea) {
                // Append to existing content if any
                textarea.value = textarea.value ? `${textarea.value}, ${prompt}` : prompt;
                textarea.dispatchEvent(new Event('input'));
                textarea.focus();
            }
        });
        
        container.appendChild(button);
    });
}

function updateNegativePromptLanguage(lang) {
    const toggle = document.getElementById('negative-prompt-toggle');
    const label = document.querySelector('label[for="negative-prompt-textarea"] .label-text');
    const textarea = document.getElementById('negative-prompt-textarea');
    const note = document.querySelector('.negative-prompt-note .note-text');
    
    if (toggle) {
        const isVisible = document.getElementById('negative-prompt-container').style.display !== 'none';
        const toggleText = toggle.querySelector('.toggle-text');
        
        toggleText.textContent = negativePromptTranslations[lang].negativePromptToggle;
        toggle.querySelector('i').className = isVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
    }
    
    if (label) label.textContent = negativePromptTranslations[lang].negativePromptLabel;
    if (textarea) textarea.placeholder = negativePromptTranslations[lang].negativePromptPlaceholder;
    if (note) note.textContent = negativePromptTranslations[lang].negativePromptNote;
    
    addCommonNegativePrompts();
}

function setupNegativePromptIntegration() {
    // Integrate with language system
    const originalUpdateLanguage = window.updateLanguage;
    window.updateLanguage = function(lang) {
        if (originalUpdateLanguage) originalUpdateLanguage(lang);
        updateNegativePromptLanguage(lang);
    };
    
    // Modify generateImage function to include negative prompt
    const originalGenerateImage = window.generateImage;
    window.generateImage = async function() {
        const negativePrompt = document.getElementById('negative-prompt-textarea')?.value.trim() || '';
        
        if (negativePrompt) {
            // Coin check
            if (window.canGenerateImage && !window.canGenerateImage()) {
                showError(currentLanguage === 'en' 
                    ? 'You have no coins left. Coins will reset in 24 hours.' 
                    : 'Koin Anda sudah habis. Koin akan direset dalam 24 jam.');
                return;
            }

            const prompt = document.getElementById('prompt-textarea')?.value.trim() || '';
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

            // Prepare for generation
            const generatedImage = document.getElementById('generated-image');
            const loadingElement = document.querySelector('.loading');
            if (generatedImage && loadingElement) {
                scrollToImageContainer();
                generatedImage.style.display = 'none';
                document.querySelectorAll('.btn').forEach(btn => btn.style.display = 'none');
                const errorMessage = document.querySelector('.error-message');
                if (errorMessage) errorMessage.style.display = 'none';
                loadingElement.style.display = 'block';
            }
            
            // Build full prompt with negative
            const fullPrompt = `${prompt} | NOT: ${negativePrompt}`;
            
            try {
                // Generate with negative prompt
                const imageUrl = await generateWithNegativePrompt(prompt, negativePrompt);
                
                if (!imageUrl) {
                    if (loadingElement) loadingElement.style.display = 'none';
                    return;
                }
                
                // Display result
                if (generatedImage) {
                    generatedImage.onload = function() {
                        if (loadingElement) loadingElement.style.display = 'none';
                        generatedImage.style.display = 'block';
                        document.querySelectorAll('.btn').forEach(btn => btn.style.display = 'flex');
                        scrollToImageContainer();
                    };
                    
                    generatedImage.onerror = function() {
                        if (loadingElement) loadingElement.style.display = 'none';
                        showError(currentLanguage === 'en' 
                            ? 'Failed to generate image. Please try a different prompt.' 
                            : 'Gagal menghasilkan gambar. Silakan coba dengan deskripsi yang berbeda.');
                    };
                    
                    generatedImage.src = imageUrl;
                }
            } catch (error) {
                console.error('Error generating image with negative prompt:', error);
                if (loadingElement) loadingElement.style.display = 'none';
                showError(error.message || (currentLanguage === 'en' 
                    ? 'Failed to generate image. Please try again.' 
                    : 'Gagal menghasilkan gambar. Silakan coba lagi.'));
            }
        } else {
            // No negative prompt, use original function
            if (originalGenerateImage) return originalGenerateImage();
        }
    };
}

async function generateWithNegativePrompt(prompt, negativePrompt) {
    // Implementation for your specific AI model
    // For pollinations.ai, we append the negative prompt
    const fullPrompt = `${prompt} | NOT: ${negativePrompt}`;
    
    // Use your existing generation method
    if (typeof AIModelManager !== 'undefined' && AIModelManager.generateImage) {
        return AIModelManager.generateImage(fullPrompt);
    }
    
    // Fallback to default implementation
    return generateWithPollinations(fullPrompt);
}

// Helper function to scroll to image container
function scrollToImageContainer() {
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Helper function to show error messages
function showError(message) {
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}