// Translation Module for RuangRiung AI Image Generator using Pollinations Text API
const TranslationModule = (function() {
  // Private variables
  let isOpen = false;
  const translationToggle = document.getElementById('translation-toggle');
  const translationContent = document.getElementById('translation-content');
  const translationTextarea = document.getElementById('translation-textarea');
  const translateEnIdBtn = document.getElementById('translate-en-id');
  const translateIdEnBtn = document.getElementById('translate-id-en');
  const applyTranslationBtn = document.getElementById('apply-translation');
  const promptTextarea = document.getElementById('prompt-textarea');
  
  // Pollinations Text API endpoint
  const TEXT_API = 'https://text.pollinations.ai';
  
  // Language translations
  const translations = {
    en: {
      toggleText: "Translation",
      placeholder: "Enter text to translate...",
      translateEnId: "English to Indonesia",
      translateIdEn: "Indonesia to English",
      applyText: "Apply to Prompt",
      noTextError: "Please enter text to translate",
      successMessage: "Translation completed!",
      failedMessage: "Translation failed. Please try again.",
      fallbackMessage: "Used fallback translation (may be less accurate)",
      applyError: "No translated text to apply"
    },
    id: {
      toggleText: "Terjemahan",
      placeholder: "Masukkan teks untuk diterjemahkan...",
      translateEnId: "Inggris ke Indonesia",
      translateIdEn: "Indonesia ke Inggris",
      applyText: "Terapkan ke Prompt",
      noTextError: "Silakan masukkan teks untuk diterjemahkan",
      successMessage: "Terjemahan selesai!",
      failedMessage: "Terjemahan gagal. Silakan coba lagi.",
      fallbackMessage: "Menggunakan terjemahan cadangan (mungkin kurang akurat)",
      applyError: "Tidak ada teks terjemahan untuk diterapkan"
    }
  };

  // Current language
  let currentLanguage = localStorage.getItem('language') || 'en';

  // Initialize the module
  function init() {
    // Set up event listeners
    translationToggle.addEventListener('click', toggleTranslationModule);
    translateEnIdBtn.addEventListener('click', () => translateText('en', 'id'));
    translateIdEnBtn.addEventListener('click', () => translateText('id', 'en'));
    applyTranslationBtn.addEventListener('click', applyTranslation);
    
    // Load saved state from localStorage
    const savedState = localStorage.getItem('translationModuleOpen');
    if (savedState === 'true') {
      openTranslationModule();
    }
    
    // Check if there's text to translate from previous session
    const savedText = localStorage.getItem('translationText');
    if (savedText) {
      translationTextarea.value = savedText;
    }

    // Update UI with current language
    updateTranslationUI();
  }

  // Update UI elements based on current language
  function updateTranslationUI() {
    const t = translations[currentLanguage];
    
    translationToggle.querySelector('span').textContent = t.toggleText;
    translationTextarea.placeholder = t.placeholder;
    translateEnIdBtn.innerHTML = `${t.translateEnId} <i class="fas fa-arrow-right"></i>`;
    translateIdEnBtn.innerHTML = `${t.translateIdEn} <i class="fas fa-arrow-left"></i>`;
    applyTranslationBtn.innerHTML = `<i class="fas fa-check"></i> ${t.applyText}`;
  }

  // Toggle the translation module visibility
  function toggleTranslationModule() {
    if (isOpen) {
      closeTranslationModule();
    } else {
      openTranslationModule();
    }
  }
  
  // Open the translation module
  function openTranslationModule() {
    translationContent.classList.add('show');
    translationToggle.classList.add('active');
    isOpen = true;
    localStorage.setItem('translationModuleOpen', 'true');
    translationTextarea.focus();
  }
  
  // Close the translation module
  function closeTranslationModule() {
    translationContent.classList.remove('show');
    translationToggle.classList.remove('active');
    isOpen = false;
    localStorage.setItem('translationModuleOpen', 'false');
  }
  
  // Create a translation prompt for the API
  function createTranslationPrompt(text, sourceLang, targetLang) {
    const languages = {
      'en': 'English',
      'id': 'Bahasa Indonesia'
    };
    
    return encodeURIComponent(
      `Translate the following text from ${languages[sourceLang]} to ${languages[targetLang]} without adding any explanations or notes. ` +
      `Only return the translated text. Here is the text to translate: "${text}"`
    );
  }
  
  // Translate text between languages using Pollinations API
  async function translateText(sourceLang, targetLang) {
    const text = translationTextarea.value.trim();
    const t = translations[currentLanguage];
    
    if (!text) {
      showTranslationError(t.noTextError);
      return;
    }
    
    // Save text to localStorage
    localStorage.setItem('translationText', text);
    
    try {
      // Show loading state
      const originalButtonText = 
        sourceLang === 'en' 
          ? translateEnIdBtn.innerHTML 
          : translateIdEnBtn.innerHTML;
      
      if (sourceLang === 'en') {
        translateEnIdBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + 
          (currentLanguage === 'en' ? 'Translating...' : 'Menerjemahkan...');
        translateEnIdBtn.disabled = true;
      } else {
        translateIdEnBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + 
          (currentLanguage === 'en' ? 'Translating...' : 'Menerjemahkan...');
        translateIdEnBtn.disabled = true;
      }
      
      // Create the translation prompt
      const translationPrompt = createTranslationPrompt(text, sourceLang, targetLang);
      
      // Call Pollinations Text API
      const response = await fetch(`${TEXT_API}/${translationPrompt}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }
      
      let translatedText = await response.text();
      
      // Clean up the response (remove any extra quotes or artifacts)
      translatedText = translatedText.trim();
      if (translatedText.startsWith('"') && translatedText.endsWith('"')) {
        translatedText = translatedText.slice(1, -1);
      }
      
      // Update the textarea with translated text
      translationTextarea.value = translatedText;
      
      // Show success message
      showTranslationSuccess(t.successMessage);
    } catch (error) {
      console.error('Translation error:', error);
      showTranslationError(t.failedMessage);
      
      // Fallback to simple word mapping if API fails
      const fallbackTranslation = getFallbackTranslation(text, sourceLang, targetLang);
      if (fallbackTranslation) {
        translationTextarea.value = fallbackTranslation;
        showTranslationSuccess(t.fallbackMessage);
      }
    } finally {
      // Restore button state
      if (sourceLang === 'en') {
        translateEnIdBtn.innerHTML = `${translations[currentLanguage].translateEnId} <i class="fas fa-arrow-right"></i>`;
        translateEnIdBtn.disabled = false;
      } else {
        translateIdEnBtn.innerHTML = `${translations[currentLanguage].translateIdEn} <i class="fas fa-arrow-left"></i>`;
        translateIdEnBtn.disabled = false;
      }
    }
  }
    const clearTranslationBtn = document.getElementById('clear-translation');
clearTranslationBtn.addEventListener('click', clearTranslationText);
  // Simple fallback translation for common words/phrases
  function getFallbackTranslation(text, sourceLang, targetLang) {
    if (!text) return '';
    
    // Common word mappings
    const wordMappings = {
      'en-id': {
        'a': 'sebuah',
        'the': '',
        'image': 'gambar',
        'picture': 'gambar',
        'photo': 'foto',
        'art': 'seni',
        'digital': 'digital',
        'painting': 'lukisan',
        'drawing': 'gambaran',
        'beautiful': 'indah',
        'landscape': 'pemandangan',
        'portrait': 'potret',
        'fantasy': 'fantasi',
        'sci-fi': 'fiksi ilmiah',
        'cyberpunk': 'cyberpunk',
        'anime': 'anime',
        'realistic': 'realistis',
        'surreal': 'surealis',
        'concept': 'konsep',
        'artwork': 'karya seni'
      },
      'id-en': {
        'sebuah': 'a',
        'gambar': 'image',
        'foto': 'photo',
        'seni': 'art',
        'digital': 'digital',
        'lukisan': 'painting',
        'gambaran': 'drawing',
        'indah': 'beautiful',
        'pemandangan': 'landscape',
        'potret': 'portrait',
        'fantasi': 'fantasy',
        'fiksi ilmiah': 'sci-fi',
        'cyberpunk': 'cyberpunk',
        'anime': 'anime',
        'realistis': 'realistic',
        'surealis': 'surreal',
        'konsep': 'concept',
        'karya seni': 'artwork'
      }
    };
    
    const mappingKey = `${sourceLang}-${targetLang}`;
    const mappings = wordMappings[mappingKey] || {};
    
    // Simple word-by-word translation (very basic fallback)
    return text.split(' ').map(word => {
      const lowerWord = word.toLowerCase();
      return mappings[lowerWord] || word;
    }).join(' ');
  }
  
  // Apply the translated text to the main prompt textarea
  function applyTranslation() {
    const t = translations[currentLanguage];
    const translatedText = translationTextarea.value.trim();
    if (!translatedText) {
      showTranslationError(t.applyError);
      return;
    }
    
    promptTextarea.value = translatedText;
    promptTextarea.focus();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'translation-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${currentLanguage === 'en' ? 'Translation applied to prompt!' : 'Terjemahan diterapkan ke prompt!'}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after delay
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Show translation error
  function showTranslationError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'translation-error';
    errorElement.textContent = message;
    
    translationContent.appendChild(errorElement);
    
    setTimeout(() => {
      errorElement.classList.add('fade-out');
      setTimeout(() => errorElement.remove(), 300);
    }, 3000);
  }
  
  // Show translation success
  function showTranslationSuccess(message) {
    const successElement = document.createElement('div');
    successElement.className = 'translation-success';
    successElement.textContent = message;
    
    translationContent.appendChild(successElement);
    
    setTimeout(() => {
      successElement.classList.add('fade-out');
      setTimeout(() => successElement.remove(), 300);
    }, 3000);
  }

  // Update language
  function updateLanguage(lang) {
    currentLanguage = lang;
    updateTranslationUI();
  }
  
  function clearTranslationText() {
  translationTextarea.value = '';
  localStorage.removeItem('translationText');
}
  
  // Public API
  return {
    init: init,
    open: openTranslationModule,
    close: closeTranslationModule,
    translate: translateText,
    apply: applyTranslation,
    updateLanguage: updateLanguage
  };
})();

// Initialize the module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  TranslationModule.init();
  
  // Add CSS for notifications dynamically
  const style = document.createElement('style');
  style.textContent = `
    .translation-notification, 
    .translation-success, 
    .translation-error {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      border-radius: 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      animation: fadeIn 0.3s forwards;
    }
    
    .translation-notification {
      background: var(--success);
      color: white;
    }
    
    .translation-success {
      background: var(--success);
      color: white;
    }
    
    .translation-error {
      background: var(--danger);
      color: white;
    }
    
    .fade-out {
      animation: fadeOut 0.3s forwards;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; bottom: 10px; }
      to { opacity: 1; bottom: 20px; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; bottom: 20px; }
      to { opacity: 0; bottom: 10px; }
    }

  `;
  document.head.appendChild(style);

  // Add language change listeners
  const langEn = document.getElementById('lang-en');
  const langId = document.getElementById('lang-id');

  if (langEn) {
    langEn.addEventListener('click', () => TranslationModule.updateLanguage('en'));
  }

  if (langId) {
    langId.addEventListener('click', () => TranslationModule.updateLanguage('id'));
  }
});
