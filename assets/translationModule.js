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
      clearText: "Clear Text"
    },
    id: {
      toggleText: "Terjemahan",
      placeholder: "Masukkan teks untuk diterjemahkan...",
      translateEnId: "Inggris ke Indonesia",
      translateIdEn: "Indonesia ke Inggris",
      applyText: "Terapkan ke Prompt",
      clearText: "Hapus Teks"
    }
  };

  let currentLanguage = localStorage.getItem('language') || 'en';

  function init() {
    translationToggle.addEventListener('click', toggleTranslationModule);
    translateEnIdBtn.addEventListener('click', () => translateText('en', 'id'));
    translateIdEnBtn.addEventListener('click', () => translateText('id', 'en'));
    applyTranslationBtn.addEventListener('click', applyTranslation);
    clearTranslationBtn.addEventListener('click', clearTranslationText);
    
    // Event listeners for language switch
    document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
    document.getElementById('lang-id').addEventListener('click', () => switchLanguage('id'));
    
    const savedState = localStorage.getItem('translationModuleOpen');
    if (savedState === 'true') openTranslationModule();
    
    const savedText = localStorage.getItem('translationText');
    if (savedText) translationTextarea.value = savedText;

    updateTranslationUI();
  }

  function updateTranslationUI() {
    const t = translations[currentLanguage];
    translationToggle.querySelector('span').innerHTML = `<i class="fas fa-language"></i> ${t.toggleText}`;
    translationTextarea.placeholder = t.placeholder;
    translateEnIdBtn.innerHTML = `${t.translateEnId} <i class="fas fa-arrow-right"></i>`;
    translateIdEnBtn.innerHTML = `${t.translateIdEn} <i class="fas fa-arrow-left"></i>`;
    applyTranslationBtn.innerHTML = `<i class="fas fa-check"></i> ${t.applyText}`;
    clearTranslationBtn.innerHTML = `<i class="fas fa-times"></i> ${t.clearText}`;
  }

  function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang); // Save selected language
    updateTranslationUI(); // Update the UI based on the selected language
  }

  function toggleTranslationModule() {
    isOpen ? closeTranslationModule() : openTranslationModule();
  }

  function openTranslationModule() {
    translationContent.classList.add('show');
    translationToggle.classList.add('active');
    isOpen = true;
    localStorage.setItem('translationModuleOpen', 'true');
    translationTextarea.focus();
  }

  function closeTranslationModule() {
    translationContent.classList.remove('show');
    translationToggle.classList.remove('active');
    isOpen = false;
    localStorage.setItem('translationModuleOpen', 'false');
  }

  async function translateText(sourceLang, targetLang) {
    const text = translationTextarea.value.trim();
    if (!text) {
      showTranslationError(translations[currentLanguage].noTextError);
      return;
    }

    localStorage.setItem('translationText', text);

    try {
      setTranslateButtonLoadingState(sourceLang);
      const translationPrompt = createTranslationPrompt(text, sourceLang, targetLang);
      const response = await fetch(`${TEXT_API}/${translationPrompt}`, { method: 'GET', headers: { 'Accept': 'text/plain' } });

      if (!response.ok) throw new Error('Translation failed');

      let translatedText = await response.text();
      translatedText = cleanTranslationText(translatedText);
      translationTextarea.value = translatedText;
      showTranslationSuccess(translations[currentLanguage].successMessage);
    } catch (error) {
      showTranslationError(translations[currentLanguage].failedMessage);
    } finally {
      resetTranslateButtonState(sourceLang);
    }
  }

  function createTranslationPrompt(text, sourceLang, targetLang) {
    const languages = {
      'en': 'English',
      'id': 'Bahasa Indonesia'
    };
    return encodeURIComponent(`Translate the following text from ${languages[sourceLang]} to ${languages[targetLang]}: "${text}"`);
  }

  function setTranslateButtonLoadingState(sourceLang) {
    const button = sourceLang === 'en' ? translateEnIdBtn : translateIdEnBtn;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
    button.disabled = true;
  }

  function resetTranslateButtonState(sourceLang) {
    const button = sourceLang === 'en' ? translateEnIdBtn : translateIdEnBtn;
    button.innerHTML = `${translations[currentLanguage].translateEnId} <i class="fas fa-arrow-right"></i>`;
    button.disabled = false;
  }

  function cleanTranslationText(text) {
    return text.trim().startsWith('"') && text.trim().endsWith('"') ? text.slice(1, -1) : text.trim();
  }

  function applyTranslation() {
    const translatedText = translationTextarea.value.trim();
    if (!translatedText) {
      showTranslationError(translations[currentLanguage].applyError);
      return;
    }
    document.getElementById('prompt-textarea').value = translatedText;
    showSuccessNotification();
  }

  function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'translation-notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> Translation applied!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  function showTranslationError(message) {
    showMessage(message, 'translation-error');
  }

  function showTranslationSuccess(message) {
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
    translationTextarea.value = '';
    localStorage.removeItem('translationText');
  }

  return { init, updateLanguage: function(lang) { currentLanguage = lang; updateTranslationUI(); } };
})();

document.addEventListener('DOMContentLoaded', function() {
  TranslationModule.init();
});
