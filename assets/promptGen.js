// promptGen.js - AI Prompt Generator Module with Dynamic Model Loading and Subject Field

document.addEventListener('DOMContentLoaded', async function() {
    // Create the HTML structure
    const promptGenContainer = document.createElement('div');
    promptGenContainer.className = 'prompt-gen-module';
    promptGenContainer.innerHTML = `
        <div class="prompt-gen-toggle" id="promptGenToggle">
            <span><i class="fas fa-wand-magic-sparkles"></i> Prompt Generator</span>
            <i class="fas fa-chevron-down prompt-gen-arrow"></i>
        </div>
        <div class="prompt-gen-content" id="promptGenContent">
            <div class="prompt-gen-loading-models" id="promptGenLoadingModels">
                <div class="spinner"></div>
                <span>Loading available models...</span>
            </div>
            <div class="prompt-gen-controls" id="promptGenControls" style="display: none;">
                <div class="form-group">
                    <label for="prompt-gen-subject"><i class="fas fa-asterisk"></i> Main Subject <span style="color:#e62984">(required)</span></label>
                    <input type="text" id="prompt-gen-subject" class="form-control" 
                           placeholder="e.g. Cyberpunk city, Portrait of a warrior" required>
                    <div class="error-message" id="subject-error" style="display: none;"></div>
                </div>
                <div class="form-group">
                    <label for="prompt-gen-details"><i class="fas fa-align-left"></i> Additional Details</label>
                    <textarea id="prompt-gen-details" class="form-control" 
                              placeholder="Optional: Add specific details like style, lighting, composition"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="prompt-gen-model"><i class="fas fa-microchip"></i> AI Model</label>
                        <div class="select-container">
                            <select id="prompt-gen-model" class="form-control"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="prompt-gen-category"><i class="fas fa-tags"></i> Category</label>
                        <div class="select-container">
                            <select id="prompt-gen-category" class="form-control">
                                <option value="random">Random</option>
                                <option value="fantasy">Fantasy</option>
                                <option value="sci-fi">Sci-Fi</option>
                                <option value="realism">Realism</option>
                                <option value="anime">Anime</option>
                                <option value="photography">Photography</option>
                                <option value="cyberpunk">Cyberpunk</option>
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary" id="generate-prompt-btn">
                    <i class="fas fa-magic"></i> Generate Prompt
                </button>
                <button class="btn btn-secondary" id="clear-saved-inputs-btn" style="margin-top: 10px;">
                    <i class="fas fa-trash"></i> Clear Saved Inputs
                </button>
            </div>
            <div class="prompt-gen-result" id="promptGenResult"></div>
            <div class="prompt-gen-loading" id="promptGenLoading" style="display: none;">
                <div class="spinner"></div>
                <span>Generating creative prompt...</span>
            </div>
        </div>
    `;

    // Insert after the translation module
    const translationModule = document.querySelector('.translation-module');
    if (translationModule) {
        translationModule.insertAdjacentElement('afterend', promptGenContainer);
    } else {
        const inputGroup = document.querySelector('.input-group');
        if (inputGroup) {
            inputGroup.insertAdjacentElement('beforebegin', promptGenContainer);
        }
    }

    // Toggle functionality
    const promptGenToggle = document.getElementById('promptGenToggle');
    const promptGenContent = document.getElementById('promptGenContent');
    const promptGenArrow = document.querySelector('.prompt-gen-arrow');

    promptGenToggle.addEventListener('click', function() {
        promptGenContent.classList.toggle('show');
        promptGenArrow.classList.toggle('fa-chevron-down');
        promptGenArrow.classList.toggle('fa-chevron-up');
    });

    // Load models from API
    const modelSelect = document.getElementById('prompt-gen-model');
    const loadingModelsDiv = document.getElementById('promptGenLoadingModels');
    const controlsDiv = document.getElementById('promptGenControls');

    try {
        const response = await fetch('https://text.pollinations.ai/models');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const models = await response.json();
        
        loadingModelsDiv.style.display = 'none';
        controlsDiv.style.display = 'block';
        
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });

        if (models.some(model => model.id === 'openai')) {
            modelSelect.value = 'openai';
        }

    } catch (error) {
        console.error('Error loading models:', error);
        loadingModelsDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i> Failed to load models. Using default options.
            </div>
        `;
        
        const defaultModels = [
            { id: 'openai', name: 'OpenAI GPT-4' },
            { id: 'anthropic', name: 'Anthropic Claude' },
            { id: 'meta-llama', name: 'Meta Llama' }
        ];
        
        defaultModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });
        
        controlsDiv.style.display = 'block';
    }

    // Generate prompt button
    const generatePromptBtn = document.getElementById('generate-prompt-btn');
    const promptGenResult = document.getElementById('promptGenResult');
    const promptGenLoading = document.getElementById('promptGenLoading');
    const promptTextarea = document.getElementById('prompt-textarea');
    const subjectInput = document.getElementById('prompt-gen-subject');
    const detailsTextarea = document.getElementById('prompt-gen-details');
    const subjectError = document.getElementById('subject-error');
    const clearSavedInputsBtn = document.getElementById('clear-saved-inputs-btn');

    // Fungsi untuk menyimpan input ke localStorage
    function saveInputs() {
        localStorage.setItem('promptGenSubject', subjectInput.value);
        localStorage.setItem('promptGenDetails', detailsTextarea.value);
        localStorage.setItem('promptGenModel', modelSelect.value);
        localStorage.setItem('promptGenCategory', document.getElementById('prompt-gen-category').value);
    }

    // Fungsi untuk memulihkan input dari localStorage
    function restoreInputs() {
        const savedSubject = localStorage.getItem('promptGenSubject');
        const savedDetails = localStorage.getItem('promptGenDetails');
        const savedModel = localStorage.getItem('promptGenModel');
        const savedCategory = localStorage.getItem('promptGenCategory');
        
        if (savedSubject) subjectInput.value = savedSubject;
        if (savedDetails) detailsTextarea.value = savedDetails;
        if (savedModel) modelSelect.value = savedModel;
        if (savedCategory) document.getElementById('prompt-gen-category').value = savedCategory;
    }

    // Panggil restoreInputs saat halaman dimuat
    restoreInputs();

    // Tambahkan event listener untuk menyimpan input saat berubah
    subjectInput.addEventListener('input', saveInputs);
    detailsTextarea.addEventListener('input', saveInputs);
    modelSelect.addEventListener('change', saveInputs);
    document.getElementById('prompt-gen-category').addEventListener('change', saveInputs);

    // Juga simpan ketika generate button diklik
    generatePromptBtn.addEventListener('click', saveInputs);

    // Clear saved inputs
    clearSavedInputsBtn.addEventListener('click', function() {
        localStorage.removeItem('promptGenSubject');
        localStorage.removeItem('promptGenDetails');
        localStorage.removeItem('promptGenModel');
        localStorage.removeItem('promptGenCategory');
        subjectInput.value = '';
        detailsTextarea.value = '';
        modelSelect.value = 'openai';
        document.getElementById('prompt-gen-category').value = 'random';
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.className = 'success-message';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Saved inputs cleared!';
        promptGenResult.appendChild(feedback);
        setTimeout(() => feedback.remove(), 3000);
    });

    generatePromptBtn.addEventListener('click', async function() {
        // Validate main subject
        if (!subjectInput.value.trim()) {
            subjectError.textContent = 'Please enter a main subject';
            subjectError.style.display = 'block';
            subjectInput.focus();
            return;
        }
        subjectError.style.display = 'none';
        
        const selectedModel = modelSelect.value;
        const selectedCategory = document.getElementById('prompt-gen-category').value;
        const mainSubject = subjectInput.value.trim();
        const additionalDetails = detailsTextarea.value.trim();
        
        // Show loading state
        promptGenResult.textContent = '';
        promptGenLoading.style.display = 'flex';
        generatePromptBtn.disabled = true;

        try {
            // System message to guide the AI
            const systemMessage = {
                role: "system",
                content: `You are a creative AI prompt generator. Generate a detailed prompt for: "${mainSubject}"${additionalDetails ? ` with these details: ${additionalDetails}` : ''}.
                The prompt should be in the ${selectedCategory} category (unless random).
                Include details about style (${selectedCategory === 'random' ? 'appropriate for the subject' : selectedCategory}), composition, lighting, and quality.
                Focus on visual elements and keep it 1-2 sentences.`
            };

            // User message
            const userMessage = {
                role: "user",
                content: `Generate an AI image prompt for: ${mainSubject}${additionalDetails ? ` (Details: ${additionalDetails})` : ''}`
            };

            let fullPrompt = "";

            // Call the streaming API
            await streamChatCompletion(
                [systemMessage, userMessage],
                { 
                    model: selectedModel,
                    seed: Math.floor(Math.random() * 1000000)
                },
                (textChunk) => {
                    fullPrompt += textChunk;
                    promptGenResult.textContent = fullPrompt;
                    promptGenResult.scrollTop = promptGenResult.scrollHeight;
                }
            );

            // Add "Use this prompt" button
            const usePromptBtn = document.createElement('button');
            usePromptBtn.className = 'btn btn-secondary';
            usePromptBtn.innerHTML = '<i class="fas fa-check"></i> Use this Prompt';
            usePromptBtn.addEventListener('click', function() {
                promptTextarea.value = fullPrompt;
                promptTextarea.focus();
            });
            
            const copyPromptBtn = document.createElement('button');
            copyPromptBtn.className = 'btn btn-secondary';
            copyPromptBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyPromptBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(fullPrompt);
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip-text';
                tooltip.textContent = 'Copied!';
                copyPromptBtn.appendChild(tooltip);
                setTimeout(() => tooltip.remove(), 2000);
            });
            
            const btnContainer = document.createElement('div');
            btnContainer.className = 'prompt-action-buttons';
            btnContainer.appendChild(usePromptBtn);
            btnContainer.appendChild(copyPromptBtn);
            
            promptGenResult.appendChild(document.createElement('br'));
            promptGenResult.appendChild(btnContainer);

        } catch (error) {
            console.error('Error generating prompt:', error);
            promptGenResult.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i> Failed to generate prompt. Please try again.
                </div>
            `;
        } finally {
            promptGenLoading.style.display = 'none';
            generatePromptBtn.disabled = false;
        }
    });

    // Stream chat completion function
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
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop();

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
});