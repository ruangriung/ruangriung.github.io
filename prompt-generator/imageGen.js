// imageGen.js dengan integrasi model.json
document.addEventListener('DOMContentLoaded', function() {
    // Toggle functionality for image settings
    const toggleBtn = document.getElementById('toggle-image-settings');
    const imageSettingsContainer = document.getElementById('image-settings-container');
    const clearImageBtn = document.getElementById('clear-image-btn');
    const imageResultPanel = document.getElementById('image-result-panel');
    const imageResult = document.getElementById('image-result');
    const imageStatus = document.getElementById('image-status');
    
    // Set initial state (collapsed)
    let isExpanded = false;
    imageSettingsContainer.style.display = 'none';
    toggleBtn.textContent = '▶';
    
    // Toggle click handler
    toggleBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        if (isExpanded) {
            imageSettingsContainer.style.display = 'block';
            toggleBtn.textContent = '▼';
        } else {
            imageSettingsContainer.style.display = 'none';
            toggleBtn.textContent = '▶';
        }
    });
    
    // Load saved image settings
    function loadImageSettings() {
        const savedSettings = localStorage.getItem('imageSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('seed').value = settings.seed || '';
            document.getElementById('image-model-preset').value = settings.modelPreset || 'flux';
            document.getElementById('image-quality').value = settings.quality || 'standard';
            document.getElementById('nologo').checked = settings.nologo !== false;
            document.getElementById('enhance').checked = settings.enhance !== false;
            document.getElementById('safe').checked = settings.safe || false;
            
            // Set radio button
            const sizeRadio = document.querySelector(`input[name="image-size"][value="${settings.size || '1024x1792'}"]`);
            if (sizeRadio) sizeRadio.checked = true;
        }
    }
    
    // Save image settings
    function saveImageSettings() {
        const settings = {
            seed: document.getElementById('seed').value,
            modelPreset: document.getElementById('image-model-preset').value,
            quality: document.getElementById('image-quality').value,
            nologo: document.getElementById('nologo').checked,
            enhance: document.getElementById('enhance').checked,
            safe: document.getElementById('safe').checked,
            size: document.querySelector('input[name="image-size"]:checked').value
        };
        localStorage.setItem('imageSettings', JSON.stringify(settings));
    }
    
    // Clear image settings
    function clearImageSettings() {
        document.getElementById('seed').value = '';
        document.getElementById('image-model-preset').value = 'flux';
        document.getElementById('image-quality').value = 'standard';
        document.getElementById('nologo').checked = true;
        document.getElementById('enhance').checked = true;
        document.getElementById('safe').checked = false;
        document.querySelector('input[name="image-size"][value="1024x1792"]').checked = true;
        saveImageSettings();
    }
    
    // Load settings when page loads
    loadImageSettings();
    
    // Save settings when they change
    document.getElementById('seed').addEventListener('input', saveImageSettings);
    document.getElementById('image-model-preset').addEventListener('change', saveImageSettings);
    document.getElementById('image-quality').addEventListener('change', saveImageSettings);
    document.getElementById('nologo').addEventListener('change', saveImageSettings);
    document.getElementById('enhance').addEventListener('change', saveImageSettings);
    document.getElementById('safe').addEventListener('change', saveImageSettings);
    document.querySelectorAll('input[name="image-size"]').forEach(radio => {
        radio.addEventListener('change', saveImageSettings);
    });
    
    // Image generation functionality
    const testBtn = document.getElementById('test-btn');
    let currentPromptText = '';
    
    // Function to set current prompt from main script
    window.setCurrentPromptText = function(text) {
        currentPromptText = text;
        // Auto-expand image settings when prompt is generated
        if (!isExpanded) {
            imageSettingsContainer.style.display = 'block';
            toggleBtn.textContent = '▼';
            isExpanded = true;
        }
    };
    
    // Function to clear generated image
    window.clearGeneratedImage = function() {
        imageResultPanel.style.display = 'none';
        imageResult.innerHTML = '<p>Your generated image will appear here...</p>';
        imageStatus.textContent = '';
        
        // Remove saved image from localStorage
        const savedData = localStorage.getItem('promptGeneratorData');
        if (savedData) {
            const data = JSON.parse(savedData);
            delete data.generatedImage;
            localStorage.setItem('promptGeneratorData', JSON.stringify(data));
        }
    };
    
    // Clear image button click handler
    clearImageBtn.addEventListener('click', function() {
        window.clearGeneratedImage();
    });
    
    // Generate image button
    testBtn.addEventListener('click', async function() {
        if (!currentPromptText) {
            imageStatus.textContent = 'Please generate a prompt first';
            imageStatus.className = 'status error';
            return;
        }
        
        testBtn.disabled = true;
        imageStatus.innerHTML = '<div class="loading"></div> Generating image... This may take 10-30 seconds';
        imageStatus.className = 'status';
        imageResultPanel.style.display = 'block';
        imageResult.innerHTML = '<p class="loading-text">Generating image...</p>';
        
        try {
            // Get image generation parameters
            const imageModel = document.getElementById('image-model-preset').value;
            const quality = document.getElementById('image-quality').value;
            const nologo = document.getElementById('nologo').checked;
            const enhance = document.getElementById('enhance').checked;
            const safe = document.getElementById('safe').checked;
            const size = document.querySelector('input[name="image-size"]:checked').value;
            const style = document.getElementById('style').value || 'default style';
            
            const imageUrl = await generateImage(
                currentPromptText, 
                imageModel, 
                quality, 
                nologo, 
                enhance, 
                safe,
                size
            );
            
            // Clear container and create new structure
            imageResult.innerHTML = '';
            
            const container = document.createElement('div');
            container.className = 'image-container';
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Generated image';
            img.className = 'generated-image';
            
            // Create info panel
            const infoPanel = document.createElement('div');
            infoPanel.className = 'image-info';
            
            // Create description
            const description = document.createElement('div');
            description.className = 'image-description';
            description.innerHTML = `
                <p><strong>Prompt:</strong> ${currentPromptText.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, '')}</p>
                <p><strong>Style:</strong> ${style}</p>
                <p><strong>Size:</strong> ${size}</p>
                <p><strong>Quality:</strong> ${quality}</p>
            `;
            
            // Create download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = 'Download Image';
            downloadBtn.addEventListener('click', function() {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `ai-image-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
            
            // Assemble elements
            infoPanel.appendChild(description);
            infoPanel.appendChild(downloadBtn);
            container.appendChild(img);
            container.appendChild(infoPanel);
            imageResult.appendChild(container);
            
            imageStatus.textContent = 'Image generated successfully!';
            imageStatus.className = 'status success';
            
            // Save the generated image URL
            const savedData = JSON.parse(localStorage.getItem('promptGeneratorData') || '{}');
            savedData.generatedImage = imageUrl;
            localStorage.setItem('promptGeneratorData', JSON.stringify(savedData));
        } catch (error) {
            console.error('Error generating image:', error);
            imageStatus.textContent = 'Error generating image: ' + error.message;
            imageStatus.className = 'status error';
            imageResult.innerHTML = '<p>Failed to generate image. Please try again.</p>';
        } finally {
            testBtn.disabled = false;
        }
    });
    
    // Function to generate image using Pollinations API with custom parameters
    async function generateImage(prompt, modelPreset, quality, nologo, enhance, safe, size) {
        // Clean the prompt by removing HTML tags
        const cleanPrompt = prompt.replace(/<\/?[^>]+(>|$)/g, '');
        
        // Build the URL with parameters
        let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}`;
        
        // Add parameters based on selections
        const params = [];
        
        // Model preset
        if (modelPreset === 'flux' || modelPreset === 'turbo') {
            params.push(`model=${modelPreset}`);
        }
        
        // Quality
        if (quality === 'high' || quality === 'ultra') {
            params.push(`quality=${quality}`);
        }
        
        // Size
        params.push(`width=${size.split('x')[0]}`);
        params.push(`height=${size.split('x')[1]}`);
        
        // Other parameters
        if (nologo) params.push('nologo=true');
        if (enhance) params.push('enhance=true');
        if (!safe) params.push('safe=false');
        
        // Add parameters to URL if any
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        
        // Create image element to force load
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject(new Error('Failed to generate image. The API might be busy. Please try again in a moment.'));
            img.src = url;
        });
    }
    
    // Load any previously generated image
    function loadGeneratedImage() {
        const savedData = localStorage.getItem('promptGeneratorData');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.generatedImage) {
                imageResultPanel.style.display = 'block';
                imageResult.innerHTML = `
                    <div class="image-container">
                        <img src="${data.generatedImage}" alt="Generated image" class="generated-image">
                        <div class="image-info">
                            <div class="image-description">
                                <p><strong>Prompt:</strong> ${data.generatedPrompt ? data.generatedPrompt.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, '') : 'No prompt available'}</p>
                            </div>
                            <button class="download-btn">Download Image</button>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    // Load generated image when page loads
    loadGeneratedImage();
});

// Fungsi untuk memuat model dari model.json
async function loadModels() {
    try {
        const response = await fetch('model.json');
        if (!response.ok) {
            throw new Error('Failed to load models');
        }
        const models = await response.json();
        return models;
    } catch (error) {
        console.error('Error loading models:', error);
        return []; // Return array kosong jika terjadi error
    }
}

// Fungsi untuk mengisi dropdown model teks
async function populateTextModels() {
    const models = await loadModels();
    const textModelSelect = document.getElementById('text-model');
    
    // Kosongkan dropdown terlebih dahulu
    textModelSelect.innerHTML = '';
    
    // Filter model yang memiliki output teks
    const textModels = models.filter(model => 
        model.output_modalities.includes('text')
    );
    
    // Urutkan model berdasarkan provider dan nama
    textModels.sort((a, b) => {
        if (a.provider === b.provider) {
            return a.name.localeCompare(b.name);
        }
        return (a.provider || '').localeCompare(b.provider || '');
    });
    
    // Kelompokkan model berdasarkan provider
    const groupedModels = {};
    textModels.forEach(model => {
        const provider = model.provider || 'Other';
        if (!groupedModels[provider]) {
            groupedModels[provider] = [];
        }
        groupedModels[provider].push(model);
    });
    
    // Tambahkan opsi ke dropdown
    for (const [provider, providerModels] of Object.entries(groupedModels)) {
        // Tambahkan optgroup untuk setiap provider
        const optgroup = document.createElement('optgroup');
        optgroup.label = provider;
        
        providerModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.name;
            option.textContent = `${model.description}${model.provider ? ` (${model.provider})` : ''}`;
            optgroup.appendChild(option);
        });
        
        textModelSelect.appendChild(optgroup);
    }
    
    // Setel nilai default jika ada
    const savedData = localStorage.getItem('promptGeneratorData');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.textModel && textModelSelect.querySelector(`option[value="${data.textModel}"]`)) {
            textModelSelect.value = data.textModel;
        }
    }
}

// Fungsi untuk generate prompt dengan model yang dipilih
async function generatePrompt(subject, style, details, modelName) {
    const models = await loadModels();
    const selectedModel = models.find(m => m.name === modelName);
    
    const messages = [
        { 
            role: "system", 
            content: "You are an expert prompt engineer for AI image generation. " +
                    "Create detailed, effective prompts that will produce high-quality images. " +
                    "Include relevant artistic styles, composition details, lighting, and mood. " +
                    "Format the response with proper line breaks for readability."
        },
        { 
            role: "user", 
            content: `Create a detailed prompt for an image of: ${subject}. ` +
                    `${style ? `The style should be ${style}. ` : ''}` +
                    `${details ? `Additional details to include: ${details}` : ''}`
        }
    ];
    
    const options = {
        model: modelName,
        // Tambahkan parameter khusus model jika diperlukan
        ...(selectedModel?.tools ? { tools: true } : {}),
        ...(selectedModel?.vision ? { vision: true } : {})
    };
    
    const response = await postChatCompletion(messages, options);
    return formatPrompt(response.choices[0].message.content);
}

// Format the prompt response
function formatPrompt(prompt) {
    // Ensure proper line breaks and basic formatting
    return prompt
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// Generic function to call Pollinations chat API
async function postChatCompletion(messages, options = {}) {
    let url;
    const model = options.model || "openai";
    
    // Tentukan endpoint berdasarkan model
    if (model.startsWith('openai')) {
        url = "https://text.pollinations.ai/openai";
    } else if (model.startsWith('llama') || model.startsWith('mistral')) {
        url = "https://text.pollinations.ai/cloudflare";
    } else if (model.startsWith('deepseek')) {
        url = "https://text.pollinations.ai/deepseek";
    } else {
        url = "https://text.pollinations.ai/generic";
    }
    
    const payload = {
        model: model,
        messages: messages,
        ...(options.seed && { seed: options.seed }),
        ...(options.tools && { tools: options.tools }),
        ...(options.vision && { vision: options.vision }),
        referrer: "ImagePromptGeneratorWebApp",
    };
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${errorText}`);
    }
    
    return await response.json();
}

// Panggil fungsi populateTextModels saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    populateTextModels();
    
    // ... kode yang sudah ada sebelumnya ...
    
    // Update event listener untuk generate button
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async function() {
            const subject = document.getElementById('subject').value.trim();
            if (!subject) {
                document.getElementById('status').textContent = 'Please enter a main subject';
                document.getElementById('status').className = 'status error';
                return;
            }
            
            const style = document.getElementById('style').value;
            const details = document.getElementById('details').value.trim();
            const model = document.getElementById('text-model').value;
            
            generateBtn.disabled = true;
            const statusDiv = document.getElementById('status');
            statusDiv.innerHTML = '<div class="loading"></div> Generating prompt...';
            statusDiv.className = 'status';
            const promptResult = document.getElementById('prompt-result');
            promptResult.innerHTML = '<p class="loading-text">Generating prompt...</p>';
            
            try {
                const prompt = await generatePrompt(subject, style, details, model);
                window.setCurrentPromptText(prompt);
                promptResult.innerHTML = prompt;
                statusDiv.textContent = 'Prompt generated successfully!';
                statusDiv.className = 'status success';
                document.getElementById('prompt-status').textContent = '';
                
                // Save generated prompt
                const data = {
                    subject: subject,
                    style: style,
                    details: details,
                    textModel: model,
                    generatedPrompt: prompt
                };
                localStorage.setItem('promptGeneratorData', JSON.stringify(data));
            } catch (error) {
                console.error('Error generating prompt:', error);
                statusDiv.textContent = 'Error generating prompt: ' + error.message;
                statusDiv.className = 'status error';
                promptResult.innerHTML = '<p>Failed to generate prompt. Please try again.</p>';
            } finally {
                generateBtn.disabled = false;
            }
        });
    }
});