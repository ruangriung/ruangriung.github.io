/**
 * Enhanced Auto-Translate for Pollinations API with Persistent Prompt
 * Converts Indonesian prompts to English while preserving original UI text and technical terms
 * Saves prompt text between sessions using localStorage
 */

class PromptTranslator {
  constructor() {
    this.INDONESIAN_KEYWORDS = [
      'sebuah', 'orang', 'dengan', 'di', 'yang', 'ini', 'itu', 'adalah', 
      'atau', 'dan', 'tapi', 'sangat', 'memiliki', 'pada', 'ke', 'dari',
      'untuk', 'dalam', 'tidak', 'akan', 'ada', 'kamu', 'saya', 'kami',
      'mereka', 'cantik', 'indah', 'warna', 'gambar', 'foto', 'lukisan'
    ];
    this.translationCache = new Map();
    this.TRANSLATION_TIMEOUT = 5000; // 5 seconds
    this.STORAGE_KEY = 'ai_prompt_last_text';
  }

  isIndonesian(text) {
    if (!text || typeof text !== 'string') return false;
    
    const hasNonLatin = /[^\x00-\x7F]/.test(text);
    const normalizedText = text.toLowerCase();
    const hasIDKeywords = this.INDONESIAN_KEYWORDS.some(word => 
      new RegExp(`\\b${word}\\b`).test(normalizedText)
    );
    const hasCommonPatterns = 
      /(^|\s)(sedang|sudah|akan)\s\w+/i.test(text) || 
      /(^|\s)\w+\s(yang|dari|untuk)\s/i.test(text);
    
    return hasNonLatin || hasIDKeywords || hasCommonPatterns;
  }

  async translateForAI(prompt) {
    if (this.translationCache.has(prompt)) {
      return this.translationCache.get(prompt);
    }

    const translationPrompt = `Translate this Indonesian text to English for AI image generation.
Keep all artistic terms, style descriptors, names and technical terms in original form.
Never add explanations or notes, only provide the direct translation.
Text: "${prompt}"`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TRANSLATION_TIMEOUT);
      
      const response = await fetch(
        `https://text.pollinations.ai/prompt/${encodeURIComponent(translationPrompt)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      let translated = await response.text();
      translated = this.cleanTranslation(translated);
      
      if (translated && translated !== prompt) {
        this.translationCache.set(prompt, translated);
      }
      
      return translated || prompt;
    } catch (error) {
      console.error('Translation error:', error);
      return prompt;
    }
  }

  cleanTranslation(text) {
    return text.trim()
      .replace(/^["']+|["']+$/g, '')
      .replace(/\\/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\b(a|an|the)\s/gi, '')
      .trim();
  }

  savePrompt(prompt) {
    try {
      localStorage.setItem(this.STORAGE_KEY, prompt);
    } catch (e) {
      console.warn('Failed to save prompt to localStorage:', e);
    }
  }

  loadPrompt() {
    try {
      return localStorage.getItem(this.STORAGE_KEY) || '';
    } catch (e) {
      console.warn('Failed to load prompt from localStorage:', e);
      return '';
    }
  }

  clearSavedPrompt() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear prompt from localStorage:', e);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const promptTextarea = document.getElementById('prompt-textarea');
  const generateBtn = document.getElementById('generate-btn');
  const clearBtn = document.getElementById('clear-btn'); // Optional clear button
  const translator = new PromptTranslator();
  
  // Load saved prompt when page loads
  const savedPrompt = translator.loadPrompt();
  if (savedPrompt) {
    promptTextarea.value = savedPrompt;
  }
  
  // Save prompt on input changes with debounce
  let saveTimeout;
  promptTextarea.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      translator.savePrompt(promptTextarea.value);
    }, 500);
  });

  // Optional: Add clear button functionality
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      promptTextarea.value = '';
      translator.clearSavedPrompt();
    });
  }

  // Save original generateImage function
  const originalGenerateImage = window.generateImage;
  
  // Override generateImage with translation capability
  window.generateImage = async function() {
    const originalPrompt = promptTextarea.value.trim();
    
    // Validate empty prompt
    if (!originalPrompt) {
      showError(currentLanguage === 'en' ? 'Please enter a prompt' : 'Harap masukkan prompt');
      return;
    }

    // Validate coins
    if (window.canGenerateImage && !window.canGenerateImage()) {
      showError(currentLanguage === 'en' ? 'No coins remaining' : 'Koin sudah habis');
      return;
    }

    // Prepare for translation if needed
    let englishPrompt = originalPrompt;
    const shouldTranslate = translator.isIndonesian(originalPrompt);
    
    if (shouldTranslate) {
      try {
        // Show loading state
        generateBtn.disabled = true;
        const originalBtnText = generateBtn.innerHTML;
        generateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${
          currentLanguage === 'en' ? 'Translating...' : 'Menerjemahkan...'
        }`;
        
        // Get English translation
        englishPrompt = await translator.translateForAI(originalPrompt);
        
        // Show translation notification
        if (englishPrompt !== originalPrompt) {
          showNotification(
            currentLanguage === 'en' 
              ? 'Your prompt has been automatically translated' 
              : 'Prompt Anda telah diterjemahkan secara otomatis',
            3000
          );
        }
      } finally {
        // Restore button state
        generateBtn.disabled = false;
        generateBtn.innerHTML = originalBtnText;
      }
    }

    // Save original prompt for history
    const historyPrompt = promptTextarea.value;
    
    // Use English prompt for generation
    promptTextarea.value = englishPrompt;
    
    try {
      // Call original generation function
      await originalGenerateImage.call(this);
    } finally {
      // Restore original prompt and save it
      promptTextarea.value = historyPrompt;
      translator.savePrompt(historyPrompt);
    }
  };

  // Helper function to show temporary notification
  function showNotification(message, duration) {
    const notification = document.createElement('div');
    notification.className = 'translation-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 15px;
      background: rgba(0,0,0,0.7);
      color: white;
      border-radius: 4px;
      z-index: 1000;
      animation: fadeIn 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
});