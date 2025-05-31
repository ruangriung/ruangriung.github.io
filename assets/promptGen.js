// promptGen.js - AI Prompt Generator Module with Enhanced Features

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize the module
    const promptGenerator = new PromptGenerator();
    await promptGenerator.init();
});

class PromptGenerator {
    constructor() {
        this.promptTemplates = {
            'portrait': {
                name: 'Portrait',
                template: 'High-quality portrait of [subject], [details], 8k resolution, professional photography, Canon EOS 5D, bokeh effect'
            },
            'landscape': {
                name: 'Landscape',
                template: 'Breathtaking landscape of [subject], [details], golden hour lighting, ultra HD, Ansel Adams style'
            },
            'cyberpunk': {
                name: 'Cyberpunk',
                template: 'Cyberpunk style [subject], neon lights, rainy streets, [details], futuristic cityscape, Blade Runner 2049 inspired'
            },
            'product': {
                name: 'Product Shot',
                template: 'Professional product photography of [subject], [details], clean white background, studio lighting, commercial style'
            }
        };
        
        this.MAX_HISTORY_ITEMS = 20;
        this.storageKeys = {
            subject: 'promptGenSubject',
            details: 'promptGenDetails',
            model: 'promptGenModel',
            category: 'promptGenCategory',
            template: 'promptGenTemplate',
            history: 'promptHistory'
        };
        this.lastGeneratedPrompt = ''; // Store the last generated prompt
    }

    async init() {
        this.createUI();
        await this.loadModels();
        this.setupEventListeners();
        this.restoreInputs();
        this.restoreLastPrompt(); // Restore last prompt if exists
    }

    createUI() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'prompt-gen-module';
        this.container.innerHTML = `
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
                    ${this.createTemplateSelector()}
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

        // Insert into DOM
        const translationModule = document.querySelector('.translation-module');
        if (translationModule) {
            translationModule.insertAdjacentElement('afterend', this.container);
        } else {
            const inputGroup = document.querySelector('.input-group');
            if (inputGroup) {
                inputGroup.insertAdjacentElement('beforebegin', this.container);
            }
        }

        // Initialize visual builder
        this.initVisualBuilder();
    }

    createTemplateSelector() {
        const options = Object.entries(this.promptTemplates).map(([key, val]) => 
            `<option value="${key}">${val.name}</option>`).join('');
        
        return `
            <div class="form-group">
                <label for="prompt-gen-template"><i class="fas fa-clipboard-list"></i> Template</label>
                <div class="select-container">
                    <select id="prompt-gen-template" class="form-control">
                        <option value="none">None (Custom)</option>
                        ${options}
                    </select>
                </div>
            </div>
        `;
    }

    async loadModels() {
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
            this.showModelLoadError(loadingModelsDiv);
            this.loadDefaultModels(modelSelect);
            controlsDiv.style.display = 'block';
        }
    }

    showModelLoadError(loadingDiv) {
        loadingDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i> Failed to load models. Using default options.
            </div>
        `;
    }

    loadDefaultModels(modelSelect) {
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
    }

    setupEventListeners() {
        // Toggle functionality
        document.getElementById('promptGenToggle').addEventListener('click', () => this.toggleContent());
        
        // Template selection handler
        document.getElementById('prompt-gen-template').addEventListener('change', () => this.handleTemplateChange());
        
        // Generate prompt button
        document.getElementById('generate-prompt-btn').addEventListener('click', () => this.generatePrompt());
        
        // Clear saved inputs
        document.getElementById('clear-saved-inputs-btn').addEventListener('click', () => this.clearSavedInputs());
        
        // Input change handlers for saving state
        document.getElementById('prompt-gen-subject').addEventListener('input', () => this.saveInputs());
        document.getElementById('prompt-gen-details').addEventListener('input', () => this.saveInputs());
        document.getElementById('prompt-gen-model').addEventListener('change', () => this.saveInputs());
        document.getElementById('prompt-gen-category').addEventListener('change', () => this.saveInputs());
        document.getElementById('prompt-gen-template').addEventListener('change', () => this.saveInputs());
    }

    toggleContent() {
        const content = document.getElementById('promptGenContent');
        const arrow = document.querySelector('.prompt-gen-arrow');
        
        content.classList.toggle('show');
        arrow.classList.toggle('fa-chevron-down');
        arrow.classList.toggle('fa-chevron-up');
        
        if (content.classList.contains('show')) {
            this.showHistory();
            this.restoreLastPrompt(); // Restore last prompt when opening
        }
    }

    handleTemplateChange() {
        const selectedTemplate = document.getElementById('prompt-gen-template').value;
        if (selectedTemplate !== 'none') {
            const template = this.promptTemplates[selectedTemplate].template;
            document.getElementById('prompt-gen-details').placeholder = 
                `Optional details (will replace [details] in template)`;
            
            // Auto-fill category if matching
            const categorySelect = document.getElementById('prompt-gen-category');
            if (this.promptTemplates[selectedTemplate].name.toLowerCase() === categorySelect.value) {
                categorySelect.value = selectedTemplate;
            }
        }
    }

    initVisualBuilder() {
        const visualBuilderToggle = document.createElement('div');
        visualBuilderToggle.className = 'visual-builder-toggle';
        visualBuilderToggle.innerHTML = `
            <button class="btn btn-sm btn-outline-primary" id="show-visual-builder">
                <i class="fas fa-palette"></i> Visual Builder
            </button>
        `;
        document.querySelector('.prompt-gen-controls').appendChild(visualBuilderToggle);
        
        const visualBuilderPanel = document.createElement('div');
        visualBuilderPanel.className = 'visual-builder-panel';
        visualBuilderPanel.style.display = 'none';
        visualBuilderPanel.innerHTML = `
            <div class="visual-options">
                <div class="visual-option">
                    <label><i class="fas fa-brush"></i> Style</label>
                    <select class="visual-style-select form-control">
                        <option value="realistic">Realistic</option>
                        <option value="painting">Painting</option>
                        <option value="cartoon">Cartoon</option>
                        <option value="anime">Anime</option>
                        <option value="watercolor">Watercolor</option>
                        <option value="digital art">Digital Art</option>
                    </select>
                </div>
                <div class="visual-option">
                    <label><i class="fas fa-lightbulb"></i> Lighting</label>
                    <select class="visual-lighting-select form-control">
                        <option value="natural">Natural</option>
                        <option value="studio">Studio</option>
                        <option value="dramatic">Dramatic</option>
                        <option value="neon">Neon</option>
                        <option value="soft">Soft</option>
                        <option value="backlit">Backlit</option>
                    </select>
                </div>
                <div class="visual-option">
                    <label><i class="fas fa-palette"></i> Color Palette</label>
                    <div class="color-palette-container">
                        <div class="color-palette">
                            <div class="color-option selected" data-color="warm" style="background: linear-gradient(135deg, #ff9a9e, #fad0c4)" title="Warm Colors"></div>
                            <div class="color-option" data-color="cool" style="background: linear-gradient(135deg, #a1c4fd, #c2e9fb)" title="Cool Colors"></div>
                            <div class="color-option" data-color="vibrant" style="background: linear-gradient(135deg, #ff758c, #ff7eb3)" title="Vibrant Colors"></div>
                            <div class="color-option" data-color="pastel" style="background: linear-gradient(135deg, #d4fc79, #96e6a1)" title="Pastel Colors"></div>
                            <div class="color-option" data-color="monochrome" style="background: linear-gradient(135deg, #000000, #434343)" title="Monochrome"></div>
                            <div class="color-option" data-color="earthy" style="background: linear-gradient(135deg, #614385, #516395)" title="Earthy Tones"></div>
                        </div>
                    </div>
                </div>
                <button class="btn btn-sm btn-primary" id="apply-visual-settings">
                    <i class="fas fa-check"></i> Apply to Prompt
                </button>
            </div>
        `;
        document.querySelector('.prompt-gen-controls').appendChild(visualBuilderPanel);
        
        // Toggle visual builder
        document.getElementById('show-visual-builder').addEventListener('click', () => {
            visualBuilderPanel.style.display = visualBuilderPanel.style.display === 'none' ? 'block' : 'none';
        });
        
        // Apply visual settings
        document.getElementById('apply-visual-settings').addEventListener('click', () => {
            const style = document.querySelector('.visual-style-select').value;
            const lighting = document.querySelector('.visual-lighting-select').value;
            const color = document.querySelector('.color-option.selected')?.dataset.color || 'natural';
            
            let details = document.getElementById('prompt-gen-details').value;
            if (details) details += ', ';
            
            details += `${style} style, ${lighting} lighting, ${color} color palette`;
            document.getElementById('prompt-gen-details').value = details;
        });
        
        // Color selection
        visualBuilderPanel.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                visualBuilderPanel.querySelectorAll('.color-option').forEach(opt => 
                    opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    async generatePrompt() {
        // Validate inputs
        if (!this.validateInputs()) return;

        // Get input values
        const { mainSubject, additionalDetails, selectedModel, selectedCategory } = this.getInputValues();
        
        // Show loading state
        this.showLoadingState(true);

        try {
            // Generate the prompt
            const fullPrompt = await this.generateAIResponse(mainSubject, additionalDetails, selectedModel, selectedCategory);
            
            // Store the last generated prompt
            this.lastGeneratedPrompt = fullPrompt;
            
            // Display the result
            this.displayPromptResult(fullPrompt);
            
            // Save to history
            this.saveToHistory(fullPrompt, selectedModel, selectedCategory);
            
            // Show history
            this.showHistory();

        } catch (error) {
            console.error('Error generating prompt:', error);
            this.showError();
        } finally {
            this.showLoadingState(false);
        }
    }

    validateInputs() {
        const subjectInput = document.getElementById('prompt-gen-subject');
        const subjectError = document.getElementById('subject-error');
        
        if (!subjectInput.value.trim()) {
            subjectError.textContent = 'Please enter a main subject';
            subjectError.style.display = 'block';
            subjectInput.focus();
            return false;
        }
        
        subjectError.style.display = 'none';
        return true;
    }

    getInputValues() {
        const selectedModel = document.getElementById('prompt-gen-model').value;
        const selectedCategory = document.getElementById('prompt-gen-category').value;
        const selectedTemplate = document.getElementById('prompt-gen-template').value;
        let mainSubject = document.getElementById('prompt-gen-subject').value.trim();
        let additionalDetails = document.getElementById('prompt-gen-details').value.trim();
        
        // Apply template if selected
        if (selectedTemplate !== 'none') {
            const template = this.promptTemplates[selectedTemplate].template;
            mainSubject = template.replace('[subject]', mainSubject);
            additionalDetails = template.replace('[details]', additionalDetails);
        }
        
        return { mainSubject, additionalDetails, selectedModel, selectedCategory };
    }

    showLoadingState(show) {
        document.getElementById('promptGenLoading').style.display = show ? 'flex' : 'none';
        document.getElementById('generate-prompt-btn').disabled = show;
        if (!show && !this.lastGeneratedPrompt) {
            document.getElementById('promptGenResult').textContent = '';
        }
    }

    async generateAIResponse(mainSubject, additionalDetails, selectedModel, selectedCategory) {
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
        await this.streamChatCompletion(
            [systemMessage, userMessage],
            { 
                model: selectedModel,
                seed: Math.floor(Math.random() * 1000000)
            },
            (textChunk) => {
                fullPrompt += textChunk;
                document.getElementById('promptGenResult').textContent = fullPrompt;
                document.getElementById('promptGenResult').scrollTop = 
                    document.getElementById('promptGenResult').scrollHeight;
            }
        );

        return fullPrompt;
    }

    async streamChatCompletion(messages, options = {}, onChunkReceived) {
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

    displayPromptResult(fullPrompt) {
        const promptGenResult = document.getElementById('promptGenResult');
        promptGenResult.innerHTML = '';
        promptGenResult.textContent = fullPrompt;

        // Add action buttons
        const usePromptBtn = document.createElement('button');
        usePromptBtn.className = 'btn btn-secondary';
        usePromptBtn.innerHTML = '<i class="fas fa-check"></i> Use this Prompt';
        usePromptBtn.addEventListener('click', () => {
            const promptTextarea = document.getElementById('prompt-textarea');
            if (promptTextarea) {
                promptTextarea.value = fullPrompt;
                promptTextarea.focus();
            }
        });
        
        const copyPromptBtn = document.createElement('button');
        copyPromptBtn.className = 'btn btn-secondary';
        copyPromptBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        copyPromptBtn.addEventListener('click', () => {
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
    }

    showError() {
        document.getElementById('promptGenResult').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i> Failed to generate prompt. Please try again.
            </div>
        `;
    }

    saveToHistory(promptText, model, category) {
        const history = JSON.parse(localStorage.getItem(this.storageKeys.history) || '[]');
        // Avoid duplicates
        if (!history.some(item => item.prompt === promptText)) {
            history.unshift({
                prompt: promptText,
                timestamp: new Date().toISOString(),
                model: model,
                category: category
            });
            
            // Limit history size
            localStorage.setItem(this.storageKeys.history, 
                JSON.stringify(history.slice(0, this.MAX_HISTORY_ITEMS)));
        }
    }

    showHistory() {
        const history = JSON.parse(localStorage.getItem(this.storageKeys.history) || '[]');
        const historyPanel = document.createElement('div');
        historyPanel.className = 'prompt-history-panel';
        
        if (history.length === 0) {
            historyPanel.innerHTML = '<p class="no-history">No history yet. Generated prompts will appear here.</p>';
        } else {
            historyPanel.innerHTML = `
                <div class="history-header">
                    <h4><i class="fas fa-history"></i> Recent Prompts</h4>
                    <button id="clear-history-btn" class="btn btn-danger">
                        <i class="fas fa-trash"></i> Clear All
                    </button>
                </div>
                <ul class="history-list">
                    ${history.map((item, index) => `
                        <li class="history-item" data-index="${index}">
                            <div class="history-prompt">${item.prompt}</div>
                            <div class="history-meta">
                                <span class="model-badge">${item.model}</span>
                                <span class="category-badge">${item.category}</span>
                                <span class="history-date">${this.formatTimeAgo(item.timestamp)}</span>
                            </div>
                            <button class="btn btn-secondary use-prompt-btn">
                                <i class="fas fa-redo"></i> Use
                            </button>
                        </li>
                    `).join('')}
                </ul>
            `;
        }
        
        // Clear existing history panel if any
        const existingPanel = document.querySelector('.prompt-history-panel');
        if (existingPanel) existingPanel.remove();
        
        // Insert history panel after the prompt result container
        this.container.insertAdjacentElement('beforeend', historyPanel);
        
        // Add event listeners for history items
        document.querySelectorAll('.use-prompt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.closest('li').getAttribute('data-index');
                const history = JSON.parse(localStorage.getItem(this.storageKeys.history));
                const promptTextarea = document.getElementById('prompt-textarea');
                if (promptTextarea) {
                    promptTextarea.value = history[index].prompt;
                    promptTextarea.focus();
                }
            });
        });
        
        // Clear history button
        if (document.getElementById('clear-history-btn')) {
            document.getElementById('clear-history-btn').addEventListener('click', () => {
                localStorage.removeItem(this.storageKeys.history);
                this.showHistory(); // Refresh view
            });
        }
    }

    restoreLastPrompt() {
        if (this.lastGeneratedPrompt) {
            this.displayPromptResult(this.lastGeneratedPrompt);
        }
    }

    formatTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    saveInputs() {
        localStorage.setItem(this.storageKeys.subject, document.getElementById('prompt-gen-subject').value);
        localStorage.setItem(this.storageKeys.details, document.getElementById('prompt-gen-details').value);
        localStorage.setItem(this.storageKeys.model, document.getElementById('prompt-gen-model').value);
        localStorage.setItem(this.storageKeys.category, document.getElementById('prompt-gen-category').value);
        localStorage.setItem(this.storageKeys.template, document.getElementById('prompt-gen-template').value);
    }

    restoreInputs() {
        const savedSubject = localStorage.getItem(this.storageKeys.subject);
        const savedDetails = localStorage.getItem(this.storageKeys.details);
        const savedModel = localStorage.getItem(this.storageKeys.model);
        const savedCategory = localStorage.getItem(this.storageKeys.category);
        const savedTemplate = localStorage.getItem(this.storageKeys.template);
        
        if (savedSubject) document.getElementById('prompt-gen-subject').value = savedSubject;
        if (savedDetails) document.getElementById('prompt-gen-details').value = savedDetails;
        if (savedModel) document.getElementById('prompt-gen-model').value = savedModel;
        if (savedCategory) document.getElementById('prompt-gen-category').value = savedCategory;
        if (savedTemplate) document.getElementById('prompt-gen-template').value = savedTemplate;
    }

    clearSavedInputs() {
        Object.values(this.storageKeys).forEach(key => {
            if (key !== 'promptHistory') localStorage.removeItem(key);
        });
        
        document.getElementById('prompt-gen-subject').value = '';
        document.getElementById('prompt-gen-details').value = '';
        document.getElementById('prompt-gen-model').value = 'openai';
        document.getElementById('prompt-gen-category').value = 'random';
        document.getElementById('prompt-gen-template').value = 'none';
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.className = 'success-message';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Saved inputs cleared!';
        document.getElementById('promptGenResult').appendChild(feedback);
        setTimeout(() => feedback.remove(), 3000);
    }
}