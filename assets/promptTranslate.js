/**
 * Auto-Translate for Pollinations API
 * Converts Indonesian prompts to English for generation while preserving original UI text
 */

document.addEventListener('DOMContentLoaded', function() {
    const promptTextarea = document.getElementById('prompt-textarea');
    const generateBtn = document.getElementById('generate-btn');
    
    // Simpan fungsi asli generateImage
    const originalGenerateImage = window.generateImage;
    
    // Deteksi bahasa Indonesia yang lebih akurat
    function isIndonesian(text) {
        const indonesianKeywords = [
            'sebuah', 'orang', 'dengan', 'di', 'yang', 'ini', 'itu',
            'adalah', 'atau', 'dan', 'tapi', 'sangat', 'memiliki'
        ];
        const hasNonLatin = /[^\x00-\x7F]/.test(text);
        const hasIDKeywords = indonesianKeywords.some(word => 
            new RegExp(`\\b${word}\\b`, 'i').test(text)
        );
        return hasNonLatin || hasIDKeywords;
    }

    // Terjemahan khusus untuk prompt gambar AI
    async function translateForAI(prompt) {
        const translationPrompt = `Translate this Indonesian text to English for AI image generation.
Keep all artistic terms, style descriptors and proper nouns in original form.
Never add explanations, only give the translation.
Text: "${prompt}"`;

        try {
            const response = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(translationPrompt)}`);
            if (!response.ok) throw new Error('Translation failed');
            
            let translated = await response.text();
            // Bersihkan hasil terjemahan
            translated = translated.trim()
                .replace(/^["']+|["']+$/g, '') // Hapus tanda kutip
                .replace(/\\/g, '')            // Hapus backslash
                .replace(/\s+/g, ' ')          // Normalisasi spasi
                .trim();
                
            return translated || prompt; // Fallback ke original jika kosong
        } catch (error) {
            console.error('Translation error:', error);
            return prompt; // Kembalikan original jika error
        }
    }

    // Override fungsi generateImage
    window.generateImage = async function() {
        const originalPrompt = promptTextarea.value.trim();
        if (!originalPrompt) {
            showError(currentLanguage === 'en' ? 'Please enter a prompt' : 'Harap masukkan prompt');
            return;
        }

        // Validasi koin
        if (window.canGenerateImage && !window.canGenerateImage()) {
            showError(currentLanguage === 'en' 
                ? 'No coins remaining' 
                : 'Koin sudah habis');
            return;
        }

        // Proses terjemahan jika diperlukan
        let englishPrompt = originalPrompt;
        if (isIndonesian(originalPrompt)) {
            try {
                // Tampilkan status loading
                generateBtn.disabled = true;
                const originalBtnText = generateBtn.innerHTML;
                generateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${
                    currentLanguage === 'en' ? 'Translating...' : 'Menerjemahkan...'
                }`;
                
                // Dapatkan terjemahan Inggris
                englishPrompt = await translateForAI(originalPrompt);
            } catch (error) {
                console.error('Translation failed, using original prompt');
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = originalBtnText;
            }
        }

        // Simpan prompt asli untuk history
        const historyPrompt = promptTextarea.value;
        
        // Gunakan prompt Inggris untuk generasi
        promptTextarea.value = englishPrompt;
        
        try {
            // Panggil fungsi generasi asli
            await originalGenerateImage.call(this);
        } finally {
            // Kembalikan prompt asli
            promptTextarea.value = historyPrompt;
        }
    };
});