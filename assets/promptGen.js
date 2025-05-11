document.addEventListener('DOMContentLoaded', function() {
    // ====================== ELEMENT SELECTORS ======================
    const promptGenToggle = document.getElementById('prompt-gen-toggle');
    const promptGenContent = document.getElementById('prompt-gen-content');
    const promptGenArrow = document.querySelector('#prompt-gen-toggle .fa-chevron-down');
    const generatePromptBtn = document.getElementById('generate-prompt-btn');
    const applyPromptBtn = document.getElementById('apply-prompt-btn');
    const generatedPrompt = document.getElementById('generated-prompt');
    const promptTextarea = document.getElementById('prompt-textarea');
    const categorySelect = document.getElementById('prompt-category');
    const styleSelect = document.getElementById('prompt-style');
    const userSubjectInput = document.getElementById('user-subject');
    const languageToggle = document.getElementById('language-toggle');
    
    // ====================== TRANSLATIONS ======================
    const translations = {
        en: {
            title: "Prompt Generator",
            category: "Category:",
            style: "Style:",
            subject: "Subject (Optional):",
            generateBtn: "Generate Prompt",
            applyBtn: "Apply to Image Prompt",
            placeholder: "Your generated prompt will appear here...",
            successTitle: "Prompt Applied!",
            successText: "The generated prompt has been added to your image prompt.",
            noPromptTitle: "No Prompt Generated",
            noPromptText: "Please generate a prompt first before applying."
        },
        id: {
            title: "Generator Prompt",
            category: "Kategori:",
            style: "Gaya:",
            subject: "Subjek (Opsional):",
            generateBtn: "Hasilkan Prompt",
            applyBtn: "Terapkan ke Prompt Gambar",
            placeholder: "Prompt yang dihasilkan akan muncul di sini...",
            successTitle: "Prompt Diterapkan!",
            successText: "Prompt yang dihasilkan telah ditambahkan ke prompt gambar Anda.",
            noPromptTitle: "Tidak Ada Prompt",
            noPromptText: "Silakan hasilkan prompt terlebih dahulu sebelum menerapkan."
        }
    };
    
    // ====================== STATE VARIABLES ======================
    let currentLanguage = localStorage.getItem('language') || 'en';
    
    // ====================== INITIALIZATION ======================
    function init() {
        updateLanguage(currentLanguage);
        setupEventListeners();
    }
    
    // ====================== LANGUAGE FUNCTIONS ======================
    function updateLanguage(lang) {
        currentLanguage = lang;
        const t = translations[lang];
        
        promptGenToggle.innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> ${t.title} <i class="fas fa-chevron-down prompt-gen-arrow"></i>`;
        document.querySelector('.prompt-gen-options label:nth-of-type(1)').textContent = t.category;
        document.querySelector('.prompt-gen-options label:nth-of-type(2)').textContent = t.style;
        document.querySelector('.prompt-gen-subject label').innerHTML = `<i class="fas fa-pencil-alt"></i> ${t.subject}`;
        generatePromptBtn.innerHTML = `<i class="fas fa-magic"></i> ${t.generateBtn}`;
        applyPromptBtn.innerHTML = `<i class="fas fa-check"></i> ${t.applyBtn}`;
        generatedPrompt.placeholder = t.placeholder;
    }
    
    // ====================== EVENT LISTENERS ======================
    function setupEventListeners() {
        // Toggle functionality
        promptGenToggle.addEventListener('click', function() {
            const isShowing = promptGenContent.classList.toggle('show');
            const arrow = this.querySelector('.prompt-gen-arrow');
            arrow.classList.toggle('fa-chevron-down', !isShowing);
            arrow.classList.toggle('fa-chevron-up', isShowing);
        });
        
        // Language change detection
        languageToggle.addEventListener('click', function() {
            setTimeout(() => {
                const newLang = document.querySelector('.language-option.active').id === 'lang-en' ? 'en' : 'id';
                if (newLang !== currentLanguage) {
                    updateLanguage(newLang);
                }
            }, 100);
        });
        
        // Generate prompt button
        generatePromptBtn.addEventListener('click', generatePrompt);
        
        // Apply prompt button
        applyPromptBtn.addEventListener('click', applyGeneratedPrompt);
    }
    
    // ====================== PROMPT GENERATION ======================
    const promptTemplates = {
        'fantasy': {
            'detailed': 'A majestic {subject} in a {setting}, ultra detailed, intricate {details}, {lighting} lighting, 8k resolution, fantasy art',
            'cinematic': 'Epic scene of a {subject} in a {setting}, cinematic composition, dramatic {lighting}, fantasy atmosphere, highly detailed',
            'painting': 'Oil painting of a {subject} in a {setting}, brush strokes visible, {art-style} style, {lighting} lighting',
            'digital-art': 'Digital painting of a {subject} in a {setting}, {art-style} style, vibrant colors, {lighting} lighting, highly detailed'
        },
        'sci-fi': {
            'detailed': 'Futuristic {subject} in a {setting}, cyberpunk style, neon lights, ultra detailed, 8k resolution, sci-fi art',
            'cinematic': 'Sci-fi scene of a {subject} in a {setting}, cinematic composition, dramatic {lighting}, futuristic atmosphere, highly detailed',
            'painting': 'Concept art of a {subject} in a {setting}, sci-fi style, {lighting} lighting, intricate details',
            'digital-art': 'Digital artwork of a {subject} in a {setting}, sci-fi theme, vibrant colors, {lighting} lighting, highly detailed'
        },
        'realism': {
            'detailed': 'Photorealistic {subject} in a {setting}, 8k ultra HD, {lighting} lighting, highly detailed, professional photography',
            'cinematic': 'Realistic scene of a {subject} in a {setting}, cinematic composition, {lighting} lighting, highly detailed',
            'painting': 'Hyperrealistic painting of a {subject} in a {setting}, {art-style} style, {lighting} lighting, intricate details',
            'digital-art': 'Photorealistic digital art of a {subject} in a {setting}, {lighting} lighting, highly detailed'
        },
        'anime': {
            'detailed': 'Anime style {subject} in a {setting}, highly detailed, vibrant colors, {lighting} lighting, 8k resolution',
            'cinematic': 'Anime scene of a {subject} in a {setting}, cinematic composition, dramatic {lighting}, highly detailed',
            'painting': 'Anime artwork of a {subject} in a {setting}, {art-style} style, {lighting} lighting, vibrant colors',
            'digital-art': 'Digital anime art of a {subject} in a {setting}, {art-style} style, {lighting} lighting, highly detailed'
        },
        'photography': {
            'detailed': 'Professional photo of a {subject} in a {setting}, {camera} with {lens}, {lighting} lighting, 8k ultra HD',
            'cinematic': 'Cinematic photo of a {subject} in a {setting}, {camera} with {lens}, dramatic {lighting}, highly detailed',
            'painting': 'Artistic photo of a {subject} in a {setting}, {camera} with {lens}, {lighting} lighting, creative composition',
            'digital-art': 'Creative photography of a {subject} in a {setting}, {camera} with {lens}, {lighting} lighting, highly detailed'
        }
    };
    
    const promptOptions = {
        'subject': ['dragon', 'wizard', 'warrior', 'city', 'landscape', 'creature', 'robot', 'spaceship', 'animal', 'portrait'],
        'setting': ['enchanted forest', 'futuristic city', 'ancient ruins', 'space station', 'mountain peak', 'desert', 'ocean', 'castle', 'village', 'laboratory'],
        'details': ['armor', 'clothing', 'architecture', 'foliage', 'technology', 'weapons', 'jewelry', 'textures', 'materials'],
        'lighting': ['dramatic', 'soft', 'golden hour', 'neon', 'moonlit', 'sunset', 'studio', 'natural', 'backlit', 'volumetric'],
        'art-style': ['Renaissance', 'Baroque', 'Impressionist', 'Art Nouveau', 'Surrealist', 'Concept Art', 'Character Design'],
        'camera': ['Canon EOS R5', 'Sony A7R IV', 'Nikon Z7', 'Fujifilm GFX 100', 'Leica M11'],
        'lens': ['24-70mm f/2.8', '50mm f/1.2', '85mm f/1.4', '70-200mm f/2.8', 'macro lens']
    };
    
    function generatePrompt() {
        const category = categorySelect.value;
        const style = styleSelect.value;
        const userSubject = userSubjectInput.value.trim();
        
        if (!promptTemplates[category] || !promptTemplates[category][style]) {
            generatedPrompt.value = 'Invalid category or style selected';
            return;
        }
        
        let prompt = promptTemplates[category][style];
        
        // Use user's subject if provided
        if (userSubject) {
            prompt = prompt.replace(/{subject}/g, userSubject);
        }
        
        // Replace other placeholders
        for (const [key, values] of Object.entries(promptOptions)) {
            const placeholder = `{${key}}`;
            if (prompt.includes(placeholder)) {
                const randomValue = values[Math.floor(Math.random() * values.length)];
                prompt = prompt.replace(new RegExp(placeholder, 'g'), randomValue);
            }
        }
        
        generatedPrompt.value = prompt;
    }
    
    // ====================== PROMPT APPLICATION ======================
    function applyGeneratedPrompt() {
        if (generatedPrompt.value.trim()) {
            promptTextarea.value = generatedPrompt.value;
            promptTextarea.focus();
            
            // Close the prompt generator
            promptGenContent.classList.remove('show');
            const arrow = promptGenToggle.querySelector('.prompt-gen-arrow');
            arrow.classList.remove('fa-chevron-up');
            arrow.classList.add('fa-chevron-down');
            
            // Show success message
            const t = translations[currentLanguage];
            Swal.fire({
                title: t.successTitle,
                text: t.successText,
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#6c5ce7',
                background: getComputedStyle(document.body).getPropertyValue('--bg'),
                color: getComputedStyle(document.body).getPropertyValue('--text')
            });
        } else {
            const t = translations[currentLanguage];
            Swal.fire({
                title: t.noPromptTitle,
                text: t.noPromptText,
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#6c5ce7',
                background: getComputedStyle(document.body).getPropertyValue('--bg'),
                color: getComputedStyle(document.body).getPropertyValue('--text')
            });
        }
    }
    
    // ====================== INITIALIZE ======================
    init();
});