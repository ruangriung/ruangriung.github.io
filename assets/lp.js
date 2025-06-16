document.addEventListener('DOMContentLoaded', function() {
    // Set tahun berjalan di footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const promptInput = document.getElementById('landing-prompt-input');
    const generateBtn = document.getElementById('landing-generate-btn');
    
    // Animasi placeholder
    const placeholders = [
        "Hutan ajaib di malam hari...",
        "Potret ksatria futuristik, gaya sinematik...",
        "Kota bawah laut yang hilang...",
        "Kucing lucu bermain dengan benang galaksi...",
        "Interior kafe yang nyaman saat hujan, gaya anime...",
    ];
    let placeholderIndex = 0;
    if (promptInput) {
        setInterval(() => {
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            promptInput.placeholder = placeholders[placeholderIndex];
        }, 3500);
    }

    // Fungsi untuk memproses prompt dan redirect
    function processAndRedirect() {
        const promptValue = promptInput.value.trim();
        if (promptValue) {
            localStorage.setItem('landingPrompt', promptValue);
        }

        // Ubah tombol menjadi loading spinner (dengan aksesibilitas)
        generateBtn.innerHTML = `<svg class="icon spinner" role="status" aria-label="Memuat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><title>Ikon Memuat</title><path d="M224 32c0-17.7-14.3-32-32-32S160 14.3 160 32V64c0 17.7 14.3 32 32 32s32-14.3 32-32V32zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H224zm128-64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h32zM80 224c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H80zm272 64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h32zM80 352c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H80zM224 416c0-17.7-14.3-32-32-32s-32 14.3-32 32v32c0 17.7 14.3 32 32 32s32-14.3 32-32V416z"/></svg> Memuat...`;
        generateBtn.disabled = true;

        // Tunggu sejenak sebelum redirect agar user melihat feedback
        setTimeout(() => {
            window.location.href = 'generator.html';
        }, 700);
    }

    if (generateBtn && promptInput) {
        generateBtn.addEventListener('click', processAndRedirect);
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                processAndRedirect();
            }
        });
    }

    // Animasi scroll 'reveal'
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});