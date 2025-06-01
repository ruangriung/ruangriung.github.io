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

  ['basicToggle', 'cinematographyToggle', 'effectsToggle', 'moodToggle', 'advancedToggle'].forEach(id => {
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
  setupRangeInput('consistency', 'consistency-value');
  setupRangeInput('motion-intensity', 'motion-intensity-value');

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
    narration: document.getElementById('narration-input')?.value || '',
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
    weather: document.getElementById('weather')?.value || 'clear',
    videoEngine: document.getElementById('video-engine')?.value || 'stable-video-diffusion',
    seedValue: document.getElementById('seed-value')?.value || '-1',
    consistency: document.getElementById('consistency')?.value || '75',
    motionIntensity: document.getElementById('motion-intensity')?.value || '50',
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
    splitScreen: document.getElementById('split-screen')?.checked || false,
    reverseMotion: document.getElementById('reverse-motion')?.checked || false,
    timeFreeze: document.getElementById('time-freeze')?.checked || false,
    parallax: document.getElementById('parallax')?.checked || false,
    jCut: document.getElementById('j-cut')?.checked || false,
    lCut: document.getElementById('l-cut')?.checked || false,
    matchCut: document.getElementById('match-cut')?.checked || false,
    contrastCut: document.getElementById('contrast-cut')?.checked || false,
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
    setValue('narration-input', formData.narration);
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
    setValue('weather', formData.weather);
    setValue('video-engine', formData.videoEngine);
    setValue('seed-value', formData.seedValue);
    setValue('consistency', formData.consistency);
    setValue('motion-intensity', formData.motionIntensity);
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
    setChecked('split-screen', formData.splitScreen);
    setChecked('reverse-motion', formData.reverseMotion);
    setChecked('time-freeze', formData.timeFreeze);
    setChecked('parallax', formData.parallax);
    setChecked('j-cut', formData.jCut);
    setChecked('l-cut', formData.lCut);
    setChecked('match-cut', formData.matchCut);
    setChecked('contrast-cut', formData.contrastCut);

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
    document.getElementById('consistency-value').textContent = `${formData.consistency || 75}%`;
    document.getElementById('motion-intensity-value').textContent = `${formData.motionIntensity || 50}%`;

    // Restore generated prompt
    if (formData.generatedPrompt) {
      document.getElementById('generated-prompt-output').textContent = formData.generatedPrompt;
      document.getElementById('prompt-result').style.display = 'block';
    }
  } catch (error) {
    console.error('Failed to load form data:', error);
  }
};

// Engine-specific recommendations
const getEngineSpecificNotes = (engine) => {
  const notes = {
    'veo3': '- Veo3 excels at high-quality 1080p+ videos with complex motion\n- Recommended motion intensity: 60-80%\n- Best for cinematic and commercial projects',
    'veo2': '- Veo2 provides good balance between quality and generation speed\n- Optimal for 720p-1080p resolutions\n- Works well with moderate motion (40-70%)',
    'tensor-video': '- Tensor Video is great for experimental and abstract effects\n- Try higher chromatic aberration values (30-50%)\n- Best for artistic and unconventional projects',
    'stable-video-diffusion': '- Keep consistency above 70% for best results\n- Works well with 24-30 fps\n- Moderate motion intensity recommended',
    'animatediff': '- Ideal for anime/cartoon style animations\n- Works best with 24 fps\n- Lower motion intensity for more stable results',
    'sora': '- Best for photorealistic high-quality videos\n- Requires detailed prompts for best results\n- Excellent for commercial and professional use',
    'pika': '- Great for creative and artistic styles\n- Works well with painterly and stylized looks\n- Good for social media content',
    'runway': '- Excellent for professional video editing workflows\n- Integrates well with other creative tools\n- Best for precise control over output'
  };
  return notes[engine] || '- Follow general video generation best practices';
};

// AI-Optimized Prompt Generation
const generateAIPrompt = (concept, narration, params) => {
  const aspectRatio = params.aspectRatio.replace(':', 'x');
  const fps = Math.min(120, Math.max(24, parseInt(params.frameRate)));
  
  // Engine-specific recommendations
  const engineTips = {
    'veo3': 'High-quality 1080p+ videos with complex motion',
    'veo2': 'Balanced quality and generation speed',
    'tensor-video': 'Experimental and abstract video generation',
    'stable-video-diffusion': 'Stable generations with moderate motion',
    'animatediff': 'Anime/cartoon style animations',
    'sora': 'Photorealistic high-quality videos',
    'pika': 'Creative and artistic styles',
    'runway': 'Professional video editing workflows'
  };

  return `[VIDEO PROMPT]
=== VISUAL DESCRIPTION ===
${concept}

=== NARRATION/DIALOG ===
${narration || 'No narration provided'}

=== TECHNICAL SPECS ===
- Engine: ${params.videoEngine} (${engineTips[params.videoEngine] || 'General purpose'})
- Style: ${params.visualStyle}
- Duration: ${params.duration}s
- Aspect: ${aspectRatio}
- FPS: ${fps}
- Camera: ${params.cameraMovement}, ${params.cameraAngle}
- Lens: ${params.lensType}
- DoF: ${params.depthOfField}
- Lighting: ${params.timeOfDay}, ${params.weather}
- Grain: ${params.filmGrain}%
- Chromatic: ${params.chromaticAberration}%
- Color: ${params.colorGrading}
- Dynamic Range: ${params.dynamicRange}
- Seed: ${params.seedValue}
- Consistency: ${params.consistency}%
- Motion Intensity: ${params.motionIntensity}%

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
  params.effects.doubleExposure && '- Double Exposure',
  params.effects.splitScreen && '- Split Screen',
  params.effects.reverseMotion && '- Reverse Motion',
  params.effects.timeFreeze && '- Time Freeze',
  params.effects.parallax && '- Parallax Effect',
  params.effects.jCut && '- J-Cut Transition',
  params.effects.lCut && '- L-Cut Transition',
  params.effects.matchCut && '- Match Cut',
  params.effects.contrastCut && '- Contrast Cut'
].filter(Boolean).join('\n')}

=== ENGINE-SPECIFIC NOTES ===
${getEngineSpecificNotes(params.videoEngine)}

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
    const narration = document.getElementById('narration-input')?.value.trim();
    
    if (!concept) {
      alert('Please describe your video concept first!');
      return;
    }

    // Show loading state
    const originalHTML = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    this.disabled = true;

    const outputElement = document.getElementById('generated-prompt-output');
    const narrationOutput = document.getElementById('narration-output');
    const visualOutput = document.getElementById('visual-description-output');
    const techOutput = document.getElementById('technical-specs-output');
    
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
        weather: document.getElementById('weather')?.value || 'clear',
        videoEngine: document.getElementById('video-engine')?.value || 'stable-video-diffusion',
        seedValue: document.getElementById('seed-value')?.value || '-1',
        consistency: document.getElementById('consistency')?.value || '75',
        motionIntensity: document.getElementById('motion-intensity')?.value || '50',
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
          doubleExposure: document.getElementById('double-exposure')?.checked || false,
          splitScreen: document.getElementById('split-screen')?.checked || false,
          reverseMotion: document.getElementById('reverse-motion')?.checked || false,
          timeFreeze: document.getElementById('time-freeze')?.checked || false,
          parallax: document.getElementById('parallax')?.checked || false,
          jCut: document.getElementById('j-cut')?.checked || false,
          lCut: document.getElementById('l-cut')?.checked || false,
          matchCut: document.getElementById('match-cut')?.checked || false,
          contrastCut: document.getElementById('contrast-cut')?.checked || false
        },
        moodTags: [...document.querySelectorAll('#mood-tags .tag')].map(tag => tag.dataset.tag) || []
      };

      // Generate initial prompt
      const aiPrompt = generateAIPrompt(concept, narration, params);
      
      // Update individual sections
      if (visualOutput) visualOutput.textContent = concept;
      if (narrationOutput) narrationOutput.textContent = narration || 'No narration provided';
      
      const techSpecs = aiPrompt.split('=== TECHNICAL SPECS ===')[1]?.split('=== EFFECTS ===')[0] || '';
      if (techOutput) techOutput.textContent = techSpecs.trim();
      
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

// Tab Navigation
const setupPromptTabs = () => {
  const tabs = document.querySelectorAll('.prompt-tab');
  const tabContents = document.querySelectorAll('.prompt-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(tabId)?.classList.add('active');
    });
  });
};

// Enhanced Copy Functionality
const setupActionButtons = () => {
  // Copy Prompt with improved feedback
  document.getElementById('copy-prompt-btn')?.addEventListener('click', async function() {
    const activeTab = document.querySelector('.prompt-tab.active')?.getAttribute('data-tab');
    let promptText = '';
    
    switch(activeTab) {
      case 'final-prompt':
        promptText = document.getElementById('generated-prompt-output')?.textContent;
        break;
      case 'technical-specs':
        promptText = document.getElementById('technical-specs-output')?.textContent;
        break;
      case 'visual-description':
        promptText = document.getElementById('visual-description-output')?.textContent;
        break;
      case 'narration':
        promptText = document.getElementById('narration-output')?.textContent;
        break;
    }
    
    if (!promptText?.trim()) {
      showFeedback(this, 'No content to copy!', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(promptText);
      showFeedback(this, 'Copied to clipboard!', 'success');
    } catch (err) {
      showFeedback(this, 'Failed to copy', 'error');
    }
  });

  // Clear Prompt
  document.getElementById('clear-prompt-btn')?.addEventListener('click', function() {
    document.getElementById('video-concept-input').value = '';
    document.getElementById('narration-input').value = '';
    document.getElementById('generated-prompt-output').textContent = '';
    document.getElementById('technical-specs-output').textContent = '';
    document.getElementById('visual-description-output').textContent = '';
    document.getElementById('narration-output').textContent = '';
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
      'weather': 'clear',
      'video-engine': 'stable-video-diffusion',
      'seed-value': '-1',
      'consistency': '75',
      'motion-intensity': '50',
      'motion-blur': true,
      'lens-flare': false,
      'light-leaks': false,
      'film-scratches': false,
      'vhs-glitch': false,
      'montage': false,
      'datamosh': false,
      'scanlines': false,
      'vignette': false,
      'double-exposure': false,
      'split-screen': false,
      'reverse-motion': false,
      'time-freeze': false,
      'parallax': false,
      'j-cut': false,
      'l-cut': false,
      'match-cut': false,
      'contrast-cut': false
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
    document.getElementById('consistency-value').textContent = '75%';
    document.getElementById('motion-intensity-value').textContent = '50%';
    saveFormData();
    
    showFeedback(this, 'Reset Complete!', 'success');
  });

  // Export JSON
  document.getElementById('export-json-btn')?.addEventListener('click', function() {
    const formData = {
      concept: document.getElementById('video-concept-input')?.value || '',
      narration: document.getElementById('narration-input')?.value || '',
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
      weather: document.getElementById('weather')?.value || 'clear',
      videoEngine: document.getElementById('video-engine')?.value || 'stable-video-diffusion',
      seedValue: document.getElementById('seed-value')?.value || '-1',
      consistency: document.getElementById('consistency')?.value || '75',
      motionIntensity: document.getElementById('motion-intensity')?.value || '50',
      moodTags: [...document.querySelectorAll('#mood-tags .tag')].map(tag => tag.dataset.tag) || [],
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
        doubleExposure: document.getElementById('double-exposure')?.checked || false,
        splitScreen: document.getElementById('split-screen')?.checked || false,
        reverseMotion: document.getElementById('reverse-motion')?.checked || false,
        timeFreeze: document.getElementById('time-freeze')?.checked || false,
        parallax: document.getElementById('parallax')?.checked || false,
        jCut: document.getElementById('j-cut')?.checked || false,
        lCut: document.getElementById('l-cut')?.checked || false,
        matchCut: document.getElementById('match-cut')?.checked || false,
        contrastCut: document.getElementById('contrast-cut')?.checked || false
      }
    };

    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-prompt-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showFeedback(this, 'Exported!', 'success');
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
  setupPromptTabs();

  // Auto-save listeners
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('change', saveFormData);
  });
  document.getElementById('video-concept-input')?.addEventListener('input', saveFormData);
  document.getElementById('narration-input')?.addEventListener('input', saveFormData);
});