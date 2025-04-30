const TranslationModule = (function() {
  let isOpen = false;
  const translationToggle = document.getElementById('translation-toggle');
  const translationContent = document.getElementById('translation-content');
  const translationTextarea = document.getElementById('translation-textarea');
  const translateEnIdBtn = document.getElementById('translate-en-id');
  const translateIdEnBtn = document.getElementById('translate-id-en');
  const applyTranslationBtn = document.getElementById('apply-translation');
  const clearTranslationBtn = document.getElementById('clear-translation');
  
  const TEXT_API = 'https://text.pollinations.ai'; // API endpoint

  const translations = {
    en: {
      toggleText: "Translation",
      placeholder: "Enter text to translate...",
      translateEnId: "English to Indonesia",
      translateIdEn: "Indonesia to English",
      applyText: "Apply to Prompt",
      clearText: "Clear Text",
      noTextError: "Please enter text to translate",
      successMessage: "Translation successful!",
      failedMessage: "Translation failed",
      applyError: "No text to apply"
    },
    id: {
      toggleText: "Terjemahan",
      placeholder: "Masukkan teks untuk diterjemahkan...",
      translateEnId: "Inggris ke Indonesia",
      translateIdEn: "Indonesia ke Inggris",
      applyText: "Terapkan ke Prompt",
      clearText: "Hapus Teks",
      noTextError: "Masukkan teks untuk diterjemahkan",
      successMessage: "Terjemahan berhasil!",
      failedMessage: "Terjemahan gagal",
      applyError: "Tidak ada teks untuk diterapkan"
    }
  };

  let currentLanguage = localStorage.getItem('language') || 'en';

  function init() {
    if (!translationToggle) return; // Safety check if elements don't exist

    translationToggle.addEventListener('click', toggleTranslationModule);
    translateEnIdBtn.addEventListener('click', () => translateText('en', 'id'));
    translateIdEnBtn.addEventListener('click', () => translateText('id', 'en'));
    applyTranslationBtn.addEventListener('click', applyTranslation);
    clearTranslationBtn.addEventListener('click', clearTranslationText);
    
    // Event listeners for language switch
    const langEnBtn = document.getElementById('lang-en');
    const langIdBtn = document.getElementById('lang-id');
    if (langEnBtn) langEnBtn.addEventListener('click', () => switchLanguage('en'));
    if (langIdBtn) langIdBtn.addEventListener('click', () => switchLanguage('id'));
    
    const savedState = localStorage.getItem('translationModuleOpen');
    if (savedState === 'true') openTranslationModule();
    
    const savedText = localStorage.getItem('translationText');
    if (savedText) translationTextarea.value = savedText;

    updateTranslationUI();
  }

  function updateTranslationUI() {
    const t = translations[currentLanguage];
    if (translationToggle) {
      translationToggle.querySelector('span').innerHTML = `<i class="fas fa-language"></i> ${t.toggleText}`;
    }
    if (translationTextarea) {
      translationTextarea.placeholder = t.placeholder;
    }
    if (translateEnIdBtn) {
      translateEnIdBtn.innerHTML = `${t.translateEnId} <i class="fas fa-arrow-right"></i>`;
    }
    if (translateIdEnBtn) {
      translateIdEnBtn.innerHTML = `${t.translateIdEn} <i class="fas fa-arrow-left"></i>`;
    }
    if (applyTranslationBtn) {
      applyTranslationBtn.innerHTML = `<i class="fas fa-check"></i> ${t.applyText}`;
    }
    if (clearTranslationBtn) {
      clearTranslationBtn.innerHTML = `<i class="fas fa-times"></i> ${t.clearText}`;
    }
  }

  function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateTranslationUI();
  }

  function toggleTranslationModule() {
    isOpen ? closeTranslationModule() : openTranslationModule();
  }

  function openTranslationModule() {
    if (translationContent) translationContent.classList.add('show');
    if (translationToggle) translationToggle.classList.add('active');
    isOpen = true;
    localStorage.setItem('translationModuleOpen', 'true');
    if (translationTextarea) translationTextarea.focus();
  }

  function closeTranslationModule() {
    if (translationContent) translationContent.classList.remove('show');
    if (translationToggle) translationToggle.classList.remove('active');
    isOpen = false;
    localStorage.setItem('translationModuleOpen', 'false');
  }

  async function translateText(sourceLang, targetLang) {
    if (!translationTextarea) return;
    
    const text = translationTextarea.value.trim();
    if (!text) {
      showTranslationError(translations[currentLanguage].noTextError);
      return;
    }

    localStorage.setItem('translationText', text);

    try {
      setTranslateButtonLoadingState(sourceLang, targetLang);
      const translationPrompt = createTranslationPrompt(text, sourceLang, targetLang);
      const response = await fetch(`${TEXT_API}/${translationPrompt}`, { 
        method: 'GET', 
        headers: { 'Accept': 'text/plain' } 
      });

      if (!response.ok) throw new Error('Translation failed');

      let translatedText = await response.text();
      translatedText = cleanTranslationText(translatedText);
      translationTextarea.value = translatedText;
      showTranslationSuccess(translations[currentLanguage].successMessage);
    } catch (error) {
      console.error('Translation error:', error);
      showTranslationError(translations[currentLanguage].failedMessage);
    } finally {
      resetTranslateButtonState(sourceLang, targetLang);
    }
  }

  function createTranslationPrompt(text, sourceLang, targetLang) {
    const languages = {
      'en': 'English',
      'id': 'Bahasa Indonesia'
    };
    return encodeURIComponent(`Translate the following text from ${languages[sourceLang]} to ${languages[targetLang]}: "${text}"`);
  }

  function setTranslateButtonLoadingState(sourceLang, targetLang) {
    const button = sourceLang === 'en' ? translateEnIdBtn : translateIdEnBtn;
    if (!button) return;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
    button.disabled = true;
  }

  function resetTranslateButtonState(sourceLang, targetLang) {
    const button = sourceLang === 'en' ? translateEnIdBtn : translateIdEnBtn;
    if (!button) return;
    
    const buttonText = sourceLang === 'en' 
      ? translations[currentLanguage].translateEnId 
      : translations[currentLanguage].translateIdEn;
    const arrowIcon = sourceLang === 'en' ? 'fa-arrow-right' : 'fa-arrow-left';
    button.innerHTML = `${buttonText} <i class="fas ${arrowIcon}"></i>`;
    button.disabled = false;
  }

  function cleanTranslationText(text) {
    return text.trim().replace(/^"(.*)"$/, '$1').trim();
  }

  function applyTranslation() {
    if (!translationTextarea) return;
    
    const translatedText = translationTextarea.value.trim();
    if (!translatedText) {
      showTranslationError(translations[currentLanguage].applyError);
      return;
    }
    
    const promptTextarea = document.getElementById('prompt-textarea');
    if (promptTextarea) {
      promptTextarea.value = translatedText;
      showSuccessNotification();
    }
  }

  function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'translation-notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${translations[currentLanguage].successMessage}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  function showTranslationError(message) {
    if (!translationContent) return;
    showMessage(message, 'translation-error');
  }

  function showTranslationSuccess(message) {
    if (!translationContent) return;
    showMessage(message, 'translation-success');
  }

  function showMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.className = className;
    messageElement.textContent = message;
    translationContent.appendChild(messageElement);
    setTimeout(() => messageElement.remove(), 3000);
  }

  function clearTranslationText() {
    if (translationTextarea) {
      translationTextarea.value = '';
      localStorage.removeItem('translationText');
    }
  }

  return { 
    init, 
    updateLanguage: function(lang) { 
      currentLanguage = lang; 
      updateTranslationUI(); 
    } 
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  TranslationModule.init();
});
