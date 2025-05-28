document.addEventListener('DOMContentLoaded', function() {
    // Toggle TTS module visibility
    const ttsToggle = document.getElementById('tts-toggle');
    const ttsContent = document.getElementById('tts-content');
    const ttsArrow = ttsToggle.querySelector('.tts-arrow');
    
    ttsToggle.addEventListener('click', function() {
        const isHidden = ttsContent.style.display === 'none' || !ttsContent.style.display;
        ttsContent.style.display = isHidden ? 'block' : 'none';
        ttsArrow.className = isHidden ? 'fas fa-chevron-up tts-arrow' : 'fas fa-chevron-down tts-arrow';
        
        if (isHidden) {
            ttsToggle.classList.add('active');
        } else {
            ttsToggle.classList.remove('active');
        }
    });

    // TTS elements
    const ttsTextarea = document.getElementById('tts-textarea');
    const voiceSelect = document.getElementById('tts-voice-select');
    const generateBtn = document.getElementById('tts-generate-btn');
    const stopBtn = document.getElementById('tts-stop-btn');
    const clearBtn = document.getElementById('tts-clear-btn');
    const audioElement = document.getElementById('tts-audio-element');
    const audioContainer = document.getElementById('tts-audio-container');
    const statusDiv = document.getElementById('tts-status');
    const downloadLink = document.getElementById('tts-download-link');
    
    // Load saved data
    const savedText = localStorage.getItem('ttsText');
    const savedVoice = localStorage.getItem('ttsVoice');
    
    if (savedText) {
        ttsTextarea.value = savedText;
    }
    
    if (savedVoice) {
        voiceSelect.value = savedVoice;
    }

    // Store text changes
    ttsTextarea.addEventListener('input', function() {
        localStorage.setItem('ttsText', this.value);
    });

    // Store voice changes
    voiceSelect.addEventListener('change', function() {
        localStorage.setItem('ttsVoice', this.value);
    });

    // State variables
    let originalText = savedText || '';
    let variationCount = 0;
    let currentAudioUrl = '';
    
    // Clear functionality
    clearBtn.addEventListener('click', function() {
        ttsTextarea.value = '';
        originalText = '';
        variationCount = 0;
        currentAudioUrl = '';
        audioContainer.style.display = 'none';
        statusDiv.style.display = 'none';
        localStorage.removeItem('ttsText');
    });

    // Generate audio
    generateBtn.addEventListener('click', async function() {
        const currentText = ttsTextarea.value.trim();
        
        if (!currentText) {
            showStatus('Please enter text first', 'error');
            return;
        }
        
        if (currentText !== originalText) {
            originalText = currentText;
            variationCount = 0;
        } else {
            variationCount++;
        }
        
        generateBtn.disabled = true;
        stopBtn.disabled = false;
        showStatus('Generating audio...', 'loading');
        audioContainer.style.display = 'none';
        
        try {
            const voice = voiceSelect.value;
            const variedText = applyTextVariation(currentText, variationCount);
            const result = await generateAudio(variedText, voice);
            
            currentAudioUrl = result.audioUrl;
            audioElement.src = currentAudioUrl;
            audioContainer.style.display = 'block';
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            downloadLink.href = currentAudioUrl;
            downloadLink.download = `tts-${voice}-v${variationCount+1}-${timestamp}.mp3`;
            
            showStatus(`Audio generated (variation ${variationCount + 1})!`, 'success');
            
            audioElement.play().catch(e => {
                console.log('Autoplay prevented:', e);
                showStatus('Click play button to listen', 'loading');
            });
        } catch (error) {
            console.error('Error:', error);
            showStatus(`Error: ${error.message}`, 'error');
        } finally {
            generateBtn.disabled = false;
            stopBtn.disabled = true;
        }
    });
    
    stopBtn.addEventListener('click', function() {
        audioElement.pause();
        audioElement.currentTime = 0;
        stopBtn.disabled = true;
    });
    
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    function applyTextVariation(text, variationIndex) {
        if (variationIndex === 0) return text;
        
        const variationMethod = variationIndex % 5;
        
        switch(variationMethod) {
            case 0: return insertRandomPauses(text);
            case 1: return addRandomEmphasis(text);
            case 2: return modifyPunctuation(text);
            case 3: return addWordVariations(text);
            case 4: return adjustSpacing(text);
            default: return text;
        }
    }
    
    function insertRandomPauses(text) {
        const sentences = text.split(/(?<=[.!?])\s+/);
        return sentences.map(s => {
            if (Math.random() > 0.7 && s.length > 15) {
                const words = s.split(' ');
                const insertPos = Math.floor(words.length / 2);
                words.splice(insertPos, 0, ',');
                return words.join(' ');
            }
            return s;
        }).join(' ');
    }
    
    function addRandomEmphasis(text) {
        const words = text.split(' ');
        if (words.length < 3) return text;
        const emphasizePos = Math.floor(Math.random() * (words.length - 2)) + 1;
        words[emphasizePos] = words[emphasizePos].toUpperCase();
        return words.join(' ');
    }
    
    function modifyPunctuation(text) {
        return text.replace(/([^.!?])([.!?])/g, (m, p1, p2) => {
            if (Math.random() > 0.8) return p1 + (p2 === '.' ? '!' : '.');
            return m;
        });
    }
    
    function addWordVariations(text) {
        const replacements = {
            'the': ['the', 'a', 'some'],
            'is': ['is', 'was', 'might be'],
            'and': ['and', 'or', 'but']
        };
        
        return text.split(' ').map(word => {
            const lowerWord = word.toLowerCase();
            if (replacements[lowerWord] && Math.random() > 0.7) {
                const options = replacements[lowerWord];
                return options[Math.floor(Math.random() * options.length)];
            }
            return word;
        }).join(' ');
    }
    
    function adjustSpacing(text) {
        if (Math.random() > 0.7) {
            return text.replace(/([,;:])\s*/g, '$1  ');
        }
        return text;
    }
    
    async function generateAudio(text, voice = "alloy") {
        const encodedText = encodeURIComponent(text);
        const randomSeed = Math.floor(Math.random() * 10000);
        const params = new URLSearchParams({
            model: "openai-audio",
            voice: voice,
            seed: randomSeed,
            variation: randomSeed % 3 + 1
        });
        
        const url = `https://text.pollinations.ai/${encodedText}?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        if (response.headers.get("Content-Type")?.includes("audio/mpeg")) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            return {
                audioUrl: audioUrl,
                blob: audioBlob
            };
        } else {
            const errorText = await response.text();
            throw new Error("API did not return audio content.");
        }
    }

    // Auto-populate from prompt selection
    const promptTextarea = document.getElementById('prompt-textarea');
    promptTextarea.addEventListener('mouseup', function() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText.length > 0) {
            ttsTextarea.value = selectedText;
            originalText = selectedText;
            variationCount = 0;
            localStorage.setItem('ttsText', selectedText);
        }
    });

    // Dark mode style updates
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', updateTTSStyles);

    function updateTTSStyles() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const status = document.querySelector('.tts-status');
        if (status) {
            if (status.classList.contains('loading')) {
                status.style.backgroundColor = isDarkMode ? '#3d3d00' : '#fff3cd';
                status.style.color = isDarkMode ? '#ffeaa7' : '#856404';
            } else if (status.classList.contains('success')) {
                status.style.backgroundColor = isDarkMode ? '#1e3b1e' : '#d4edda';
                status.style.color = isDarkMode ? '#55efc4' : '#155724';
            } else if (status.classList.contains('error')) {
                status.style.backgroundColor = isDarkMode ? '#3d1e1e' : '#f8d7da';
                status.style.color = isDarkMode ? '#ff7675' : '#721c24';
            }
        }
    }
});