// assets/faqModule.js
document.addEventListener('DOMContentLoaded', function() {
    // FAQ translations
    const faqTranslations = {
        en: {
            title: "Frequently Asked Questions",
            questions: [
                {
                    question: "What is RuangRiung AI Image Generator?",
                    answer: "RuangRiung AI Image Generator is a powerful tool that uses artificial intelligence to create stunning images from text descriptions. You can generate various art styles, from photorealistic to anime, digital paintings to 3D renders."
                },
                {
                    question: "How do I get the best results?",
                    answer: `For best results:
                    <ul>
                        <li>Use detailed, descriptive prompts in English</li>
                        <li>Specify the art style you want</li>
                        <li>Adjust dimensions and quality settings</li>
                        <li>Experiment with different lighting and composition options</li>
                    </ul>`
                },
                {
                    question: "Why should I write prompts in English?",
                    answer: "The AI models are primarily trained on English text, so prompts in English generally produce more accurate and consistent results. You can use the translation assistant if you're more comfortable in another language."
                },
                {
                    question: "What are coins and how do they work?",
                    answer: "Coins are our way of managing usage fairly. You start with 500 coins, and each image generation consumes coins based on size and quality. Your coins reset every 24 hours. Higher quality and larger images cost more coins."
                },
                {
                    question: "Can I use the generated images commercially?",
                    answer: "Yes, you own all images you generate with RuangRiung AI. However, please check the terms of service for any restrictions based on the model used (some third-party models may have different policies)."
                },
                {
                    question: "How can I improve faces in generated images?",
                    answer: `You can use the "Enhance Faces" option in the AI Enhancements panel after generation. For better initial results, try adding terms like:
                    <ul>
                        <li>"highly detailed face"</li>
                        <li>"8k portrait"</li>
                        <li>"professional portrait photography"</li>
                    </ul>`
                }
            ]
        },
        id: {
            title: "Pertanyaan yang Sering Diajukan",
            questions: [
                {
                    question: "Apa itu RuangRiung AI Image Generator?",
                    answer: "RuangRiung AI Image Generator adalah alat canggih yang menggunakan kecerdasan buatan untuk membuat gambar menakjubkan dari deskripsi teks. Anda bisa menghasilkan berbagai gaya seni, mulai dari fotorealistik hingga anime, lukisan digital hingga render 3D."
                },
                {
                    question: "Bagaimana cara mendapatkan hasil terbaik?",
                    answer: `Untuk hasil terbaik:
                    <ul>
                        <li>Gunakan deskripsi yang detail dalam bahasa Inggris</li>
                        <li>Tentukan gaya seni yang diinginkan</li>
                        <li>Atur dimensi dan kualitas gambar</li>
                        <li>Eksperimen dengan berbagai opsi pencahayaan dan komposisi</li>
                    </ul>`
                },
                {
                    question: "Mengapa harus menulis prompt dalam bahasa Inggris?",
                    answer: "Model AI terutama dilatih dengan teks bahasa Inggris, sehingga prompt dalam bahasa Inggris umumnya menghasilkan hasil yang lebih akurat dan konsisten. Anda bisa menggunakan asisten terjemahan jika lebih nyaman dengan bahasa lain."
                },
                {
                    question: "Apa itu koin dan bagaimana cara kerjanya?",
                    answer: "Koin adalah cara kami mengelola penggunaan secara adil. Anda mulai dengan 500 koin, dan setiap pembuatan gambar menggunakan koin berdasarkan ukuran dan kualitas. Koin Anda akan direset setiap 24 jam. Gambar dengan kualitas lebih tinggi dan ukuran lebih besar membutuhkan lebih banyak koin."
                },
                {
                    question: "Bisakah saya menggunakan gambar yang dihasilkan untuk komersial?",
                    answer: "Ya, Anda memiliki semua gambar yang Anda hasilkan dengan RuangRiung AI. Namun, harap periksa ketentuan layanan untuk pembatasan berdasarkan model yang digunakan (beberapa model pihak ketiga mungkin memiliki kebijakan berbeda)."
                },
                {
                    question: "Bagaimana cara memperbaiki wajah pada gambar yang dihasilkan?",
                    answer: `Anda bisa menggunakan opsi "Tingkatkan Wajah" di panel Peningkatan AI setelah generasi. Untuk hasil awal yang lebih baik, coba tambahkan istilah seperti:
                    <ul>
                        <li>"wajah sangat detail"</li>
                        <li>"potret 8k"</li>
                        <li>"fotografi potret profesional"</li>
                    </ul>`
                }
            ]
        }
    };

    // Get current language from localStorage or default to English
    let currentLanguage = localStorage.getItem('language') || 'en';

    // Create FAQ container
    const faqContainer = document.createElement('div');
    faqContainer.className = 'card faq-container';
    faqContainer.id = 'faq-container';
    
    // Generate FAQ content based on current language
    function generateFAQContent(lang) {
        const t = faqTranslations[lang];
        
        let faqHTML = `
            <h3><i class="fas fa-question-circle"></i> ${t.title}</h3>
            <div class="faq-content">
        `;
        
        t.questions.forEach((item, index) => {
            faqHTML += `
                <div class="faq-item">
                    <div class="faq-question">
                        <span>${item.question}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        ${item.answer}
                    </div>
                </div>
            `;
        });
        
        faqHTML += `</div>`;
        return faqHTML;
    }
    
    // Set initial FAQ content
    faqContainer.innerHTML = generateFAQContent(currentLanguage);

    // Insert FAQ above footer
    const footer = document.querySelector('footer');
    footer.parentNode.insertBefore(faqContainer, footer);

    // FAQ toggle functionality
    function setupFAQToggle() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');
                
                // Toggle answer visibility
                if (answer.style.display === 'block') {
                    answer.style.display = 'none';
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    answer.style.display = 'block';
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            });
        });

        // Initially hide all answers
        document.querySelectorAll('.faq-answer').forEach(answer => {
            answer.style.display = 'none';
        });
    }
    
    // Initialize FAQ toggle
    setupFAQToggle();
    
    // Function to update FAQ language
    function updateFAQLanguage(lang) {
        faqContainer.innerHTML = generateFAQContent(lang);
        setupFAQToggle();
    }
    
    // Listen for language changes from the main app
    document.addEventListener('languageChanged', (e) => {
        currentLanguage = e.detail.language;
        updateFAQLanguage(currentLanguage);
    });
    
    // Alternatively, you can check for language changes periodically
    setInterval(() => {
        const newLanguage = localStorage.getItem('language') || 'en';
        if (newLanguage !== currentLanguage) {
            currentLanguage = newLanguage;
            updateFAQLanguage(currentLanguage);
        }
    }, 1000);
});