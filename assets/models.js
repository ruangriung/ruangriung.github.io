// AI Model Manager - Encapsulated Module
const AIModelManager = (function() {
    // Private variables
    const API_KEYS = {
        dalle3: {
            key: localStorage.getItem('dalle3_api_key') || '',
            timestamp: localStorage.getItem('dalle3_api_key_timestamp') || 0
        },
        stability: {
            key: localStorage.getItem('stability_api_key') || '',
            timestamp: localStorage.getItem('stability_api_key_timestamp') || 0
        },
        turbo: {
            key: localStorage.getItem('turbo_password') || '',
            timestamp: localStorage.getItem('turbo_password_timestamp') || 0
        }
    };

    const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const MODEL_ENDPOINTS = {
        dalle3: 'https://api.openai.com/v1/images/generations',
        stability: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image'
    };
    
    let currentModel = 'flux'; // Default to flux
    let expiryInterval;
    
    // DOM Elements
    const modelSelect = document.getElementById('model');
    const apiKeyModal = document.getElementById('api-key-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const apiKeyTitle = document.getElementById('api-key-modal-title');
    const apiKeyInstructions = document.getElementById('api-key-instructions');
    const apiKeyNote = document.getElementById('api-key-note');
    const validateApiKeyBtn = document.getElementById('validate-api-key-btn');
    const cancelApiKeyBtn = document.getElementById('cancel-api-key-btn');
    const closeApiKeyModal = document.getElementById('close-api-key-modal');
    const safeFilterCheckbox = document.getElementById('safe-filter');
    const resetBtn = document.getElementById('reset-btn');
    
    // Private methods
    function showApiKeyModal(model) {
        currentModel = model;
        
        const oldShowPassword = document.getElementById('show-password');
        if (oldShowPassword) {
            oldShowPassword.replaceWith(oldShowPassword.cloneNode(true));
        }
        
        if (model === 'dalle3') {
            apiKeyTitle.innerHTML = '<i class="fas fa-key"></i> OpenAI API Key Required';
            apiKeyInstructions.textContent = 'Please enter your OpenAI API key to use DALL-E 3.';
            apiKeyNote.innerHTML = `
                <div>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI</a>.</div>
                <div style="margin-top: 10px; color: #FF6B6B; font-size: 0.9em;">
                    <i class="fas fa-clock"></i> For security reasons, API keys will expire after 24 hours
                </div>
            `;
            apiKeyInput.value = API_KEYS.dalle3.key;
            apiKeyInput.placeholder = 'sk-...';
            apiKeyInput.type = 'password';
        } else if (model === 'stability') {
            apiKeyTitle.innerHTML = '<i class="fas fa-key"></i> Stability AI API Key Required';
            apiKeyInstructions.textContent = 'Please enter your Stability AI API key.';
            apiKeyNote.innerHTML = `
                <div>Get your API key from <a href="https://platform.stability.ai/account/keys" target="_blank">Stability AI</a>.</div>
                <div style="margin-top: 10px; color: #FF6B6B; font-size: 0.9em;">
                    <i class="fas fa-clock"></i> For security reasons, API keys will expire after 24 hours
                </div>
            `;
            apiKeyInput.value = API_KEYS.stability.key;
            apiKeyInput.placeholder = 'sk-...';
            apiKeyInput.type = 'password';
        } else if (model === 'turbo') {
            apiKeyTitle.innerHTML = '<i class="fas fa-lock"></i> Turbo Model Password';
            apiKeyInstructions.textContent = 'Please enter the password to access Turbo model.';
            apiKeyNote.innerHTML = `
                <div style="margin-top: 10px;">
                    <input type="checkbox" id="show-password"> Display password
                </div>
                <div style="margin-top: 10px; color: #FF6B6B;">
                    <i class="fas fa-exclamation-triangle"></i> Important Notice: You are solely responsible for all AI-generated content.
                </div>
                <div style="margin-top: 10px; font-size: 0.9em;">
                    For password access, please contact the <a href="https://www.facebook.com/groups/1182261482811767/?ref=share&mibextid=lOuIew" target="_blank">RuangRiung</a> <strong>Admin Team</strong>.
                    This security measure helps maintain platform integrity by preventing potential misuse.
                </div>
                <div style="margin-top: 10px; color: #FF6B6B; font-size: 0.9em;">
                    <i class="fas fa-clock"></i> For security reasons, password will expire after 24 hours
                </div>
            `;
            apiKeyInput.value = API_KEYS.turbo.key;
            apiKeyInput.placeholder = 'Enter password...';
            apiKeyInput.type = 'password';
            
            document.getElementById('show-password')?.addEventListener('change', function(e) {
                apiKeyInput.type = e.target.checked ? 'text' : 'password';
            });
        }
        
        apiKeyModal.style.display = 'flex';
        apiKeyInput.focus();
    }
    
    function hideApiKeyModal() {
        apiKeyModal.style.display = 'none';
    }
    
    function clearAllData() {
        // Save coin data before reset
        const savedCoins = localStorage.getItem('ruangriung_coin_data');
        
        // Clear memory
        API_KEYS.dalle3.key = '';
        API_KEYS.dalle3.timestamp = 0;
        API_KEYS.stability.key = '';
        API_KEYS.stability.timestamp = 0;
        API_KEYS.turbo.key = '';
        API_KEYS.turbo.timestamp = 0;
        
        // Clear localStorage but keep coins
        localStorage.removeItem('dalle3_api_key');
        localStorage.removeItem('dalle3_api_key_timestamp');
        localStorage.removeItem('stability_api_key');
        localStorage.removeItem('stability_api_key_timestamp');
        localStorage.removeItem('turbo_password');
        localStorage.removeItem('turbo_password_timestamp');
        
        // Restore coin data if exists
        if (savedCoins) {
            localStorage.setItem('ruangriung_coin_data', savedCoins);
        }
        
        // Reset form values
        if (modelSelect) modelSelect.value = 'flux';
        if (safeFilterCheckbox) safeFilterCheckbox.checked = true;
        if (apiKeyInput) apiKeyInput.value = '';
        
        // Reset current model
        currentModel = 'flux';
        
        // Clear session data except what's needed
        sessionStorage.clear();
        
        // Clear expiry interval
        clearInterval(expiryInterval);
        
        // Update backToTop button
        initBackToTopButton();
    }
    
    function isKeyExpired(timestamp) {
        if (!timestamp) return true;
        return Date.now() - parseInt(timestamp) > EXPIRATION_TIME;
    }
    
    function formatTimeRemaining(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    
    function updateExpiryInfo() {
        const expiryDisplay = document.getElementById('model-expiry-display');
        if (!expiryDisplay) return;
        
        const keyData = API_KEYS[currentModel];
        if (!keyData.key) {
            expiryDisplay.textContent = '';
            expiryDisplay.style.display = 'none';
            return;
        }
        
        if (isKeyExpired(keyData.timestamp)) {
            expiryDisplay.innerHTML = `
                <span style="color: #FF6B6B; background: rgba(255,107,107,0.1); padding: 4px 8px; border-radius: 4px;">
                    <i class="fas fa-exclamation-circle"></i> Expired
                </span>
            `;
            expiryDisplay.style.display = 'block';
        } else {
            const timeLeft = EXPIRATION_TIME - (Date.now() - parseInt(keyData.timestamp));
            expiryDisplay.innerHTML = `
                <span style="color: #51CF66; background: rgba(81,207,102,0.1); padding: 4px 8px; border-radius: 4px;">
                    <i class="fas fa-clock"></i> Expires in: ${formatTimeRemaining(timeLeft)}
                </span>
            `;
            expiryDisplay.style.display = 'block';
        }
    }
    
    function startExpiryTimer() {
        clearInterval(expiryInterval);
        updateExpiryInfo();
        expiryInterval = setInterval(updateExpiryInfo, 1000);
    }
    
    async function validateApiKey() {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showError('Please enter a valid API key/password');
            return;
        }
        
        validateApiKeyBtn.disabled = true;
        validateApiKeyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validating...';
        
        try {
            let isValid = false;
            
            if (currentModel === 'dalle3') {
                isValid = await validateOpenAIKey(apiKey);
            } else if (currentModel === 'stability') {
                isValid = await validateStabilityKey(apiKey);
            } else if (currentModel === 'turbo') {
                isValid = apiKey === 'ruangriungxyz';
                if (isValid) {
                    if (safeFilterCheckbox) safeFilterCheckbox.checked = false;
                }
            }
            
            if (isValid) {
                // Save key and current timestamp
                API_KEYS[currentModel].key = apiKey;
                API_KEYS[currentModel].timestamp = Date.now();
                
                localStorage.setItem(
                    currentModel === 'turbo' ? 'turbo_password' : 
                    currentModel === 'dalle3' ? 'dalle3_api_key' : 'stability_api_key', 
                    apiKey
                );
                localStorage.setItem(
                    currentModel === 'turbo' ? 'turbo_password_timestamp' : 
                    currentModel === 'dalle3' ? 'dalle3_api_key_timestamp' : 'stability_api_key_timestamp', 
                    Date.now().toString()
                );
                
                hideApiKeyModal();
                
                if (modelSelect) modelSelect.value = currentModel;
                
                showSuccess(
                    currentModel === 'turbo' ? 
                    'Password validated! <span style="color: #FF6B6B">NSFW filter has been disabled</span><br>' + 
                    '<div style="margin-top: 10px; color: #51CF66;">' +
                    '<i class="fas fa-clock"></i> This password will expire in 24 hours' +
                    '</div>' : 
                    'API key validated successfully!<br>' + 
                    '<div style="margin-top: 10px; color: #51CF66;">' +
                    '<i class="fas fa-clock"></i> This API key will expire in 24 hours' +
                    '</div>'
                );
                
                startExpiryTimer();
            } else {
                showError('Invalid API key/password. Please check and try again.');
                if (modelSelect) modelSelect.value = 'flux';
                currentModel = 'flux';
            }
        } catch (error) {
            console.error('Validation error:', error);
            showError('Error validating API key. Please try again.');
            if (modelSelect) modelSelect.value = 'flux';
            currentModel = 'flux';
        } finally {
            validateApiKeyBtn.disabled = false;
            validateApiKeyBtn.textContent = 'Validate & Save';
        }
    }
    
    async function validateOpenAIKey(apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            return response.ok && (await response.json()).data;
        } catch (error) {
            console.error('OpenAI validation error:', error);
            return false;
        }
    }
    
    async function validateStabilityKey(apiKey) {
        try {
            const response = await fetch('https://api.stability.ai/v1/user/account', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Stability validation error:', error);
            return false;
        }
    }
    
    function handleModelChange() {
        if (!modelSelect) return true;
        
        const selectedModel = modelSelect.value;
        
        if (['turbo', 'dalle3', 'stability'].includes(selectedModel)) {
            // Check if key exists and is not expired
            const keyData = API_KEYS[selectedModel];
            if (!keyData.key || isKeyExpired(keyData.timestamp)) {
                showApiKeyModal(selectedModel);
                return false;
            }
            
            if (selectedModel === 'turbo' && safeFilterCheckbox) {
                safeFilterCheckbox.checked = false;
            }
            
            currentModel = selectedModel;
            startExpiryTimer();
        } else if (selectedModel === 'flux' && safeFilterCheckbox) {
            safeFilterCheckbox.checked = true;
            clearInterval(expiryInterval);
            const expiryDisplay = document.getElementById('model-expiry-display');
            if (expiryDisplay) expiryDisplay.style.display = 'none';
        }
        
        currentModel = selectedModel;
        return true;
    }
    
    function setupResetButton() {
        if (!resetBtn) return;
        
        resetBtn.addEventListener('click', function() {
            Swal.fire({
                title: 'Reset All Data?',
                html: `
                    <div style="color: #FF6B6B; margin-bottom: 15px;">
                        <i class="fas fa-exclamation-triangle"></i> This will permanently delete:
                    </div>
                    <ul style="text-align: left; margin-left: 20px;">
                        <li>All API keys and passwords</li>
                        <li>Application preferences</li>
                        <li>Session data</li>
                    </ul>
                    <div style="margin-top: 15px; color: #51CF66;">
                        <i class="fas fa-info-circle"></i> Note: Your coins will NOT be reset
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#51CF66',
                cancelButtonColor: '#FF6B6B',
                confirmButtonText: 'Yes, reset everything',
                cancelButtonText: 'Cancel',
                background: '#2B2D42',
                color: '#EDF2F4',
                width: '90%',
                maxWidth: '500px'
            }).then((result) => {
                if (result.isConfirmed) {
                    clearAllData();
                    showSuccess('All data has been reset successfully!').then(() => {
                        location.reload();
                    });
                }
            });
        });
    }
    
    function initBackToTopButton() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }
    
    // Helper functions
    function showError(message) {
        return Swal.fire({
            title: 'Error',
            html: message,
            icon: 'error',
            confirmButtonColor: '#51CF66',
            background: '#2B2D42',
            color: '#EDF2F4'
        });
    }
    
    function showSuccess(message) {
        return Swal.fire({
            title: 'Success',
            html: message,
            icon: 'success',
            confirmButtonColor: '#51CF66',
            background: '#2B2D42',
            color: '#EDF2F4'
        });
    }
    
    // Public methods
    async function generateImage(prompt, settings) {
        if (!handleModelChange()) return null;
        
        try {
            switch(currentModel) {
                case 'dalle3':
                    return await generateWithDalle3(prompt, settings);
                case 'stability':
                    return await generateWithStability(prompt, settings);
                case 'turbo':
                    return generateWithPollinations(prompt, settings, 'turbo');
                default:
                    return generateWithPollinations(prompt, settings, 'flux');
            }
        } catch (error) {
            console.error('Generation error:', error);
            showError(error.message || 'Failed to generate image');
            throw error;
        }
    }
    
    async function generateWithDalle3(prompt, settings) {
        const response = await fetch(MODEL_ENDPOINTS.dalle3, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.dalle3.key}`
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "dall-e-3",
                size: `${settings.width}x${settings.height}`,
                quality: settings.quality === 'ultra' ? 'hd' : 'standard',
                n: 1
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'DALL-E 3 generation failed');
        }
        
        return (await response.json()).data[0].url;
    }
    
    async function generateWithStability(prompt, settings) {
        const response = await fetch(MODEL_ENDPOINTS.stability, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.stability.key}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt }],
                cfg_scale: 7,
                height: parseInt(settings.height),
                width: parseInt(settings.width),
                samples: 1,
                steps: 30
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Stability AI generation failed');
        }
        
        return `data:image/png;base64,${(await response.json()).artifacts[0].base64}`;
    }
    
    function generateWithPollinations(prompt, settings, modelType = 'flux') {
        const params = new URLSearchParams({
            width: settings.width || 1024,
            height: settings.height || 1024,
            nologo: true,
            safe: modelType === 'turbo' ? false : settings.safeFilter !== false,
            model: modelType
        });
        
        if (settings.seed) params.set('seed', settings.seed);
        
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
    }
    
    // Initialize
    function init() {
        if (modelSelect) {
            // Create container for model select and expiry info
            const modelSelectContainer = document.createElement('div');
            modelSelectContainer.style.display = 'flex';
            modelSelectContainer.style.alignItems = 'center';
            modelSelectContainer.style.gap = '10px';
            modelSelectContainer.style.width = '100%';
            modelSelectContainer.style.marginBottom = '15px';

            // Wrap the existing select
            modelSelect.parentNode.insertBefore(modelSelectContainer, modelSelect);
            modelSelectContainer.appendChild(modelSelect);

            // Create expiry display element
            const expiryDisplay = document.createElement('div');
            expiryDisplay.id = 'model-expiry-display';
            expiryDisplay.style.fontSize = '0.85em';
            expiryDisplay.style.marginLeft = 'auto';
            modelSelectContainer.appendChild(expiryDisplay);

            modelSelect.innerHTML = `
                <option value="flux">FLUX</option>
                <option value="turbo">Turbo (AI NSFW)</option>
                <option value="dalle3">DALL-E 3 (OpenAI)</option>
                <option value="stability">Stability AI</option>
            `;
            modelSelect.value = currentModel;
            modelSelect.addEventListener('change', handleModelChange);
        }

        if (validateApiKeyBtn) validateApiKeyBtn.addEventListener('click', validateApiKey);
        if (cancelApiKeyBtn) cancelApiKeyBtn.addEventListener('click', () => {
            if (modelSelect) modelSelect.value = 'flux';
            hideApiKeyModal();
        });
        if (closeApiKeyModal) closeApiKeyModal.addEventListener('click', () => {
            if (modelSelect) modelSelect.value = 'flux';
            hideApiKeyModal();
        });
        if (apiKeyModal) apiKeyModal.addEventListener('click', (e) => {
            if (e.target === apiKeyModal) {
                if (modelSelect) modelSelect.value = 'flux';
                hideApiKeyModal();
            }
        });
        
        setupResetButton();
        initBackToTopButton();
        
        // Initialize expiry timer if a key is already set
        if (API_KEYS[currentModel].key && !isKeyExpired(API_KEYS[currentModel].timestamp)) {
            startExpiryTimer();
        }
    }
    
    // Public API
    return {
        init: init,
        generateImage: generateImage,
        clearAllData: clearAllData
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', AIModelManager.init);