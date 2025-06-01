// Dark Mode Toggle
const initializeDarkMode = () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!darkModeToggle) return;

  const updateDarkMode = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    const icon = darkModeToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-moon', !isDark);
      icon.classList.toggle('fa-sun', isDark);
    }
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  };

  darkModeToggle.addEventListener('click', () => {
    updateDarkMode(!document.body.classList.contains('dark-mode'));
  });

  updateDarkMode(localStorage.getItem('darkMode') === 'enabled');
};

// Section Toggles
const setupSectionToggles = () => {
  const setupToggle = (toggleId, contentId) => {
    const toggle = document.getElementById(toggleId);
    const content = document.getElementById(contentId);
    if (!toggle || !content) return;

    const updateToggleState = (isOpen) => {
      content.classList.toggle('show', isOpen);
      const icon = toggle.querySelector('.fa-chevron-down');
      if (icon) icon.classList.toggle('fa-chevron-up', isOpen);
      localStorage.setItem(`${toggleId}-state`, isOpen ? 'open' : 'closed');
    };

    toggle.addEventListener('click', () => updateToggleState(!content.classList.contains('show')));
    updateToggleState(localStorage.getItem(`${toggleId}-state`) === 'open');
  };

  ['basicToggle', 'cinematographyToggle', 'effectsToggle', 'moodToggle'].forEach(id => {
    setupToggle(id, `${id.replace('Toggle', 'Content')}`);
  });
};

// Form Utilities
const setupFormControls = () => {
  // Range Inputs
  const setupRangeInput = (inputId, outputId) => {
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    if (!input || !output) return;

    input.addEventListener('input', () => {
      output.textContent = `${input.value}%`;
      saveFormData();
    });
  };

  setupRangeInput('film-grain', 'grain-value');
  setupRangeInput('chromatic-aberration', 'chromatic-value');

  // Mood Tags
  const addMoodTag = () => {
    const tagInput = document.getElementById('new-mood-tag');
    const tagText = tagInput?.value.trim().toLowerCase();
    if (!tagText || document.querySelector(`.tag[data-tag="${tagText}"]`)) return;

    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.dataset.tag = tagText;
    tag.innerHTML = `${tagText}<span class="tag-remove">&times;</span>`;
    
    tag.querySelector('.tag-remove')?.addEventListener('click', () => {
      tag.remove();
      saveFormData();
    });

    document.getElementById('mood-tags')?.appendChild(tag);
    if (tagInput) tagInput.value = '';
    saveFormData();
  };

  document.getElementById('add-mood-tag')?.addEventListener('click', addMoodTag);
  document.getElementById('new-mood-tag')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addMoodTag();
  });

  // Initialize default tags
  if (!localStorage.getItem('videoPromptFormData')) {
    ['cinematic', 'dramatic', 'mysterious'].forEach(tag => {
      const input = document.getElementById('new-mood-tag');
      if (input) input.value = tag;
      addMoodTag();
    });
  }
};

// Data Persistence
const saveFormData = () => {
  const formData = {
    concept: document.getElementById('video-concept-input')?.value || '',
    visualStyle: document.getElementById('visual-style')?.value || 'cinematic',
    duration: document.getElementById('video-duration')?.value || '10',
    aspectRatio: document.getElementById('aspect-ratio')?.value || '16:9',
    frameRate: document.getElementById('frame-rate')?.value || '24',
    cameraMovement: document.getElementById('camera-movement')?.value || 'static',
    cameraAngle: document.getElementById('camera-angle')?.value || 'eye-level',
    lensType: document.getElementById('lens-type')?.value || 'standard',
    depthOfField: document.getElementById('depth-of-field')?.value || 'shallow',
    filmGrain: document.getElementById('film-grain')?.value || '20',
    chromaticAberration: document.getElementById('chromatic-aberration')?.value || '10',
    colorGrading: document.getElementById('color-grading')?.value || 'neutral',
    dynamicRange: document.getElementById('dynamic-range')?.value || 'standard',
    timeOfDay: document.getElementById('time-of-day')?.value || 'golden-hour',
    motionBlur: document.getElementById('motion-blur')?.checked || false,
    lensFlare: document.getElementById('lens-flare')?.checked || false,
    lightLeaks: document.getElementById('light-leaks')?.checked || false,
    filmScratches: document.getElementById('film-scratches')?.checked || false,
    vhsGlitch: document.getElementById('vhs-glitch')?.checked || false,
    montage: document.getElementById('montage')?.checked || false,
    datamosh: document.getElementById('datamosh')?.checked || false,
    scanlines: document.getElementById('scanlines')?.checked || false,
    vignette: document.getElementById('vignette')?.checked || false,
    doubleExposure: document.getElementById('double-exposure')?.checked || false,
    moodTags: [...document.querySelectorAll('#mood-tags .tag')].map(tag => tag.dataset.tag),
    generatedPrompt: document.getElementById('generated-prompt-output')?.textContent || ''
  };

  localStorage.setItem('videoPromptFormData', JSON.stringify(formData));
};

const loadFormData = () => {
  const savedData = localStorage.getItem('videoPromptFormData');
  if (!savedData) return;

  try {
    const formData = JSON.parse(savedData);
    
    // Set form values
    const setValue = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.value = value || '';
    };
    
    const setChecked = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!value;
    };

    setValue('video-concept-input', formData.concept);
    setValue('visual-style', formData.visualStyle);
    setValue('video-duration', formData.duration);
    setValue('aspect-ratio', formData.aspectRatio);
    setValue('frame-rate', formData.frameRate);
    setValue('camera-movement', formData.cameraMovement);
    setValue('camera-angle', formData.cameraAngle);
    setValue('lens-type', formData.lensType);
    setValue('depth-of-field', formData.depthOfField);
    setValue('film-grain', formData.filmGrain);
    setValue('chromatic-aberration', formData.chromaticAberration);
    setValue('color-grading', formData.colorGrading);
    setValue('dynamic-range', formData.dynamicRange);
    setValue('time-of-day', formData.timeOfDay);
    setChecked('motion-blur', formData.motionBlur);
    setChecked('lens-flare', formData.lensFlare);
    setChecked('light-leaks', formData.lightLeaks);
    setChecked('film-scratches', formData.filmScratches);
    setChecked('vhs-glitch', formData.vhsGlitch);
    setChecked('montage', formData.montage);
    setChecked('datamosh', formData.datamosh);
    setChecked('scanlines', formData.scanlines);
    setChecked('vignette', formData.vignette);
    setChecked('double-exposure', formData.doubleExposure);

    // Restore mood tags
    const moodTagsContainer = document.getElementById('mood-tags');
    if (moodTagsContainer) {
      moodTagsContainer.innerHTML = '';
      if (formData.moodTags?.length) {
        formData.moodTags.forEach(tag => {
          const input = document.getElementById('new-mood-tag');
          if (input) input.value = tag;
          addMoodTag();
        });
      }
    }

    // Update displays
    document.getElementById('grain-value').textContent = `${formData.filmGrain || 20}%`;
    document.getElementById('chromatic-value').textContent = `${formData.chromaticAberration || 10}%`;

    // Restore generated prompt
    if (formData.generatedPrompt) {
      document.getElementById('generated-prompt-output').textContent = formData.generatedPrompt;
      document.getElementById('prompt-result').style.display = 'block';
    }
  } catch (error) {
    console.error('Failed to load form data:', error);
  }
};

// AI-Optimized Prompt Generation
const generateAIPrompt = (concept, params) => {
  const aspectRatio = params.aspectRatio.replace(':', 'x');
  const fps = Math.min(120, Math.max(24, parseInt(params.frameRate)));
  
  return `[VIDEO PROMPT]
=== VISUAL DESCRIPTION ===
${concept}

=== TECHNICAL SPECS ===
- Style: ${params.visualStyle}
- Duration: ${params.duration}s
- Aspect: ${aspectRatio}
- FPS: ${fps}
- Camera: ${params.cameraMovement}, ${params.cameraAngle}
- Lens: ${params.lensType}
- DoF: ${params.depthOfField}
- Lighting: ${params.timeOfDay}
- Grain: ${params.filmGrain}%
- Chromatic: ${params.chromaticAberration}%
- Color: ${params.colorGrading}
- Dynamic Range: ${params.dynamicRange}

=== EFFECTS ===
${[
  params.effects.motionBlur && '- Motion Blur',
  params.effects.lensFlare && '- Lens Flare',
  params.effects.lightLeaks && '- Light Leaks',
  params.effects.filmScratches && '- Film Scratches',
  params.effects.vhsGlitch && '- VHS Glitch',
  params.effects.montage && '- Montage Effect',
  params.effects.datamosh && '- Datamosh',
  params.effects.scanlines && '- Scanlines',
  params.effects.vignette && '- Vignette',
  params.effects.doubleExposure && '- Double Exposure'
].filter(Boolean).join('\n')}

=== MOOD & COMPOSITION ===
Keywords: ${params.moodTags.join(', ')}`;
};

// API Integration with Ad Removal
const generateVideoWithAI = async (prompt, onChunkReceived, onError) => {
  const messages = [
    { 
      role: "system", 
      content: "You are a professional video prompt generator. Return ONLY the enhanced video prompt content with NO advertisements."
    },
    { 
      role: "user", 
      content: `Enhance this video prompt without any ads or promotional content:
                ${prompt}`
    }
  ];

  try {
    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        stream: true,
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data: ") && !line.includes("[DONE]")) {
          try {
            const data = JSON.parse(line.substring(6));
            const chunk = data.choices?.[0]?.delta?.content || "";
            
            if (!chunk.match(/🌸|Ad|Elevate|Learn more|http[s]?:\/\/|promotional|sponsored/gi)) {
              fullResponse += chunk;
              onChunkReceived(chunk);
            }
          } catch (e) {
            console.warn("Parse error:", e);
          }
        }
      }
    }

    return fullResponse;
  } catch (error) {
    onError(error.message);
    throw error;
  }
};

// Generate Prompt Handler
const setupPromptGeneration = () => {
  const generateBtn = document.getElementById('generate-prompt-btn');
  if (!generateBtn) return;

  generateBtn.addEventListener('click', async function() {
    const concept = document.getElementById('video-concept-input')?.value.trim();
    if (!concept) {
      alert('Please describe your video concept first!');
      return;
    }

    // Show loading state
    const originalHTML = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    this.disabled = true;

    const outputElement = document.getElementById('generated-prompt-output');
    if (outputElement) {
      outputElement.textContent = '';
      document.getElementById('prompt-result').style.display = 'block';
    }

    try {
      // Gather parameters
      const params = {
        visualStyle: document.getElementById('visual-style')?.value || 'cinematic',
        duration: document.getElementById('video-duration')?.value || '10',
        aspectRatio: document.getElementById('aspect-ratio')?.value || '16:9',
        frameRate: document.getElementById('frame-rate')?.value || '24',
        cameraMovement: document.getElementById('camera-movement')?.value || 'static',
        cameraAngle: document.getElementById('camera-angle')?.value || 'eye-level',
        lensType: document.getElementById('lens-type')?.value || 'standard',
        depthOfField: document.getElementById('depth-of-field')?.value || 'shallow',
        filmGrain: document.getElementById('film-grain')?.value || '20',
        chromaticAberration: document.getElementById('chromatic-aberration')?.value || '10',
        colorGrading: document.getElementById('color-grading')?.value || 'neutral',
        dynamicRange: document.getElementById('dynamic-range')?.value || 'standard',
        timeOfDay: document.getElementById('time-of-day')?.value || 'golden-hour',
        effects: {
          motionBlur: document.getElementById('motion-blur')?.checked || false,
          lensFlare: document.getElementById('lens-flare')?.checked || false,
          lightLeaks: document.getElementById('light-leaks')?.checked || false,
          filmScratches: document.getElementById('film-scratches')?.checked || false,
          vhsGlitch: document.getElementById('vhs-glitch')?.checked || false,
          montage: document.getElementById('montage')?.checked || false,
          datamosh: document.getElementById('datamosh')?.checked || false,
          scanlines: document.getElementById('scanlines')?.checked || false,
          vignette: document.getElementById('vignette')?.checked || false,
          doubleExposure: document.getElementById('double-exposure')?.checked || false
        },
        moodTags: [...document.querySelectorAll('#mood-tags .tag')].map(tag => tag.dataset.tag) || []
      };

      // Generate initial prompt
      const aiPrompt = generateAIPrompt(concept, params);
      
      // Stream enhanced version
      await generateVideoWithAI(
        aiPrompt,
        (chunk) => {
          if (outputElement) outputElement.textContent += chunk;
        },
        (error) => {
          if (outputElement) outputElement.textContent = `Error: ${error}`;
        }
      );

      saveFormData();
    } catch (error) {
      console.error('Generation failed:', error);
      if (outputElement) outputElement.textContent = `Error: ${error.message}`;
    } finally {
      this.innerHTML = originalHTML;
      this.disabled = false;
    }
  });
};

// Enhanced Copy Functionality
const setupActionButtons = () => {
  // Copy Prompt with improved feedback
  document.getElementById('copy-prompt-btn')?.addEventListener('click', async function() {
    const promptText = document.getElementById('generated-prompt-output')?.textContent;
    if (!promptText?.trim()) {
      showFeedback(this, 'No prompt to copy!', 'error');
      return;
    }

    try {
      // Method 1: Modern Clipboard API
      await navigator.clipboard.writeText(promptText);
      showFeedback(this, 'Copied to clipboard!', 'success');
    } catch (err) {
      try {
        // Method 2: Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
          showFeedback(this, 'Copied!', 'success');
        } else {
          throw new Error('Fallback copy failed');
        }
      } catch (fallbackErr) {
        // Method 3: Manual copy fallback
        const promptElement = document.getElementById('generated-prompt-output');
        const range = document.createRange();
        range.selectNode(promptElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
        showFeedback(this, 'Press Ctrl+C to copy', 'warning');
      }
    }
  });

  // Clear Prompt
  document.getElementById('clear-prompt-btn')?.addEventListener('click', function() {
    document.getElementById('video-concept-input').value = '';
    document.getElementById('generated-prompt-output').textContent = '';
    document.getElementById('prompt-result').style.display = 'none';
    saveFormData();
    showFeedback(this, 'Cleared!', 'success');
  });

  // Reset All
  document.getElementById('reset-all-btn')?.addEventListener('click', function() {
    if (!confirm('Reset all settings to default values?')) return;
    
    const defaults = {
      'visual-style': 'cinematic',
      'video-duration': '10',
      'aspect-ratio': '16:9',
      'frame-rate': '24',
      'camera-movement': 'static',
      'camera-angle': 'eye-level',
      'lens-type': 'standard',
      'depth-of-field': 'shallow',
      'film-grain': '20',
      'chromatic-aberration': '10',
      'color-grading': 'neutral',
      'dynamic-range': 'standard',
      'time-of-day': 'golden-hour',
      'motion-blur': true,
      'lens-flare': false,
      'light-leaks': false,
      'film-scratches': false,
      'vhs-glitch': false,
      'montage': false,
      'datamosh': false,
      'scanlines': false,
      'vignette': false,
      'double-exposure': false
    };

    Object.entries(defaults).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof value === 'boolean') {
        el.checked = value;
      } else {
        el.value = value;
      }
    });

    // Reset mood tags
    const moodTagsContainer = document.getElementById('mood-tags');
    if (moodTagsContainer) {
      moodTagsContainer.innerHTML = '';
      ['cinematic', 'dramatic', 'mysterious'].forEach(tag => {
        const input = document.getElementById('new-mood-tag');
        if (input) input.value = tag;
        addMoodTag();
      });
    }

    // Update displays
    document.getElementById('grain-value').textContent = '20%';
    document.getElementById('chromatic-value').textContent = '10%';
    saveFormData();
    
    showFeedback(this, 'Reset Complete!', 'success');
  });
};

// Universal Feedback Function
const showFeedback = (element, message, type = 'success') => {
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-circle'
  };
  
  const colors = {
    success: '#00b894',
    error: '#d63031',
    warning: '#fdcb6e'
  };

  const originalHTML = element.innerHTML;
  const originalBg = element.style.background;

  element.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
  element.style.background = colors[type];
  element.style.color = '#fff';

  setTimeout(() => {
    element.innerHTML = originalHTML;
    element.style.background = originalBg;
    element.style.color = '';
  }, 2000);
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initializeDarkMode();
  setupSectionToggles();
  setupFormControls();
  loadFormData();
  setupPromptGeneration();
  setupActionButtons();

  // Auto-save listeners
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('change', saveFormData);
  });
  document.getElementById('video-concept-input')?.addEventListener('input', saveFormData);
});