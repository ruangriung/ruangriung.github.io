// AI Model Manager - Encapsulated Module
const AIModelManager = (function() {
    // Private variables
    const API_KEYS = {
        dalle3: localStorage.getItem('dalle3_api_key') || '',
        stability: localStorage.getItem('stability_api_key') || ''
    };
    
    const MODEL_ENDPOINTS = {
        dalle3: 'https://api.openai.com/v1/images/generations',
        stability: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image'
    };
    
    let currentModel = 'pollinations';
    
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
    
    // Private methods
    function showApiKeyModal(model) {
        currentModel = model;
        
        // Update modal content based on model
        if (model === 'dalle3') {
            apiKeyTitle.innerHTML = '<i class="fas fa-key"></i> OpenAI API Key Required';
            apiKeyInstructions.textContent = 'Please enter your OpenAI API key to use DALL-E 3.';
            apiKeyNote.innerHTML = 'Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI</a>.';
            apiKeyInput.value = API_KEYS.dalle3;
            apiKeyInput.placeholder = 'sk-...';
        } else if (model === 'stability') {
            apiKeyTitle.innerHTML = '<i class="fas fa-key"></i> Stability AI API Key Required';
            apiKeyInstructions.textContent = 'Please enter your Stability AI API key.';
            apiKeyNote.innerHTML = 'Get your API key from <a href="https://platform.stability.ai/account/keys" target="_blank">Stability AI</a>.';
            apiKeyInput.value = API_KEYS.stability;
            apiKeyInput.placeholder = 'sk-...';
        }
        
        apiKeyModal.style.display = 'flex';
        apiKeyInput.focus();
    }
    
    function hideApiKeyModal() {
        apiKeyModal.style.display = 'none';
    }
    
    async function validateApiKey() {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            alert('Please enter a valid API key');
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
            }
            
            if (isValid) {
                // Save the valid API key
                API_KEYS[currentModel] = apiKey;
                localStorage.setItem(`${currentModel}_api_key`, apiKey);
                hideApiKeyModal();
                
                // Update the model select to the validated model
                modelSelect.value = currentModel;
                alert('API key validated successfully!');
            } else {
                alert('Invalid API key. Please check and try again.');
                // Revert to pollinations (FLUX Turbo)
                modelSelect.value = 'pollinations';
                currentModel = 'pollinations';
            }
        } catch (error) {
            console.error('API key validation error:', error);
            alert('Error validating API key. Please try again.');
            // Revert to pollinations (FLUX Turbo)
            modelSelect.value = 'pollinations';
            currentModel = 'pollinations';
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
            
            if (response.ok) {
                const data = await response.json();
                return Array.isArray(data.data);
            }
            return false;
        } catch (error) {
            console.error('OpenAI key validation error:', error);
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
            console.error('Stability key validation error:', error);
            return false;
        }
    }
    
    function handleModelChange() {
        const selectedModel = modelSelect.value;
        
        if (selectedModel === 'dalle3' || selectedModel === 'stability') {
            if (!API_KEYS[selectedModel]) {
                showApiKeyModal(selectedModel);
                return false; // Prevent model change until validated
            }
        }
        
        currentModel = selectedModel;
        return true;
    }
    
// Public methods
    async function generateImage(prompt, settings) {
        if (!handleModelChange()) {
            return null; // API key not validated
        }
        
        try {
            switch(currentModel) {
                case 'dalle3':
                    return await generateWithDalle3(prompt, settings);
                case 'stability':
                    return await generateWithStability(prompt, settings);
                case 'pollinations':
                default:
                    return generateWithPollinations(prompt, settings);
            }
        } catch (error) {
            console.error('Image generation error:', error);
            throw error;
        }
    }
    
    async function generateWithDalle3(prompt, settings) {
        const response = await fetch(MODEL_ENDPOINTS.dalle3, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.dalle3}`
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
            throw new Error(errorData.error?.message || 'Failed to generate image with DALL-E 3');
        }
        
        const data = await response.json();
        return data.data[0].url;
    }
    
    async function generateWithStability(prompt, settings) {
        const response = await fetch(MODEL_ENDPOINTS.stability, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.stability}`,
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
            throw new Error(errorData.message || 'Failed to generate image with Stability AI');
        }
        
        const data = await response.json();
        // Stability returns base64 image data
        return `data:image/png;base64,${data.artifacts[0].base64}`;
    }
    
    function generateWithPollinations(prompt, settings) {
        const width = settings.width || 1024;
        const height = settings.height || 1024;
        const safeFilter = settings.safeFilter !== false;
        let ratioParam = `?width=${width}&height=${height}&nologo=true&safe=${safeFilter}`;
        
        if (settings.seed) {
            ratioParam += `&seed=${settings.seed}`;
        }
        
        const encodedPrompt = encodeURIComponent(prompt);
        return `https://image.pollinations.ai/prompt/${encodedPrompt}${ratioParam}`;
    }
    
    // Initialize
    function init() {
        modelSelect.addEventListener('change', function() {
            if (!handleModelChange()) {
                // If API key is not validated, revert to pollinations
                modelSelect.value = 'pollinations';
                currentModel = 'pollinations';
            }
        });
        
        validateApiKeyBtn.addEventListener('click', validateApiKey);
        cancelApiKeyBtn.addEventListener('click', () => {
            modelSelect.value = 'pollinations';
            currentModel = 'pollinations';
            hideApiKeyModal();
        });
        closeApiKeyModal.addEventListener('click', () => {
            modelSelect.value = 'pollinations';
            currentModel = 'pollinations';
            hideApiKeyModal();
        });
        
        apiKeyModal.addEventListener('click', function(e) {
            if (e.target === apiKeyModal) {
                modelSelect.value = 'pollinations';
                currentModel = 'pollinations';
                hideApiKeyModal();
            }
        });
    }
    
    // Public API
    return {
        init: init,
        generateImage: generateImage
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AIModelManager.init();
});