document.addEventListener('DOMContentLoaded', function() {
    // Dapatkan elemen yang diperlukan
    const widthSlider = document.getElementById('width-slider');
    const heightSlider = document.getElementById('height-slider');
    const widthValue = document.getElementById('width-value');
    const heightValue = document.getElementById('height-value');
    const sizePresetSelect = document.getElementById('size-preset');
    const aspectRatioDisplay = document.getElementById('aspect-ratio-display');

    // Preset dimensi
    const sizePresets = {
        'portrait': { width: 1024, height: 1792 },
        'square': { width: 1024, height: 1024 },
        'landscape': { width: 1792, height: 1024 }
    };

    // Fungsi untuk mengupdate slider berdasarkan preset
    function updateSlidersFromPreset(width, height) {
        widthSlider.value = width;
        heightSlider.value = height;
        widthValue.textContent = width;
        heightValue.textContent = height;
        
        // Update aspect ratio display
        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const ratio = gcd(width, height);
        const aspectRatio = `${width/ratio}:${height/ratio}`;
        aspectRatioDisplay.textContent = `Aspect Ratio: ${aspectRatio}`;
        
        // Update slider fill
        updateSliderFill();
    }

    // Event listener untuk dropdown preset
    sizePresetSelect.addEventListener('change', function() {
        const preset = this.value;
        
        if (preset !== 'custom') {
            const { width, height } = sizePresets[preset];
            updateSlidersFromPreset(width, height);
        }
    });

    // Event listener untuk slider yang mengubah dropdown kembali ke custom
    [widthSlider, heightSlider].forEach(slider => {
        slider.addEventListener('input', function() {
            // Cek apakah nilai slider sesuai dengan salah satu preset
            const currentWidth = parseInt(widthSlider.value);
            const currentHeight = parseInt(heightSlider.value);
            
            let isPreset = false;
            for (const [key, preset] of Object.entries(sizePresets)) {
                if (currentWidth === preset.width && currentHeight === preset.height) {
                    sizePresetSelect.value = key;
                    isPreset = true;
                    break;
                }
            }
            
            if (!isPreset) {
                sizePresetSelect.value = 'custom';
            }
        });
    });

    // Fungsi untuk update slider fill (diambil dari ruangriung.js)
    function updateSliderFill() {
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 100;
            const value = parseFloat(slider.value) || 0;
            const percentage = ((value - min) / (max - min)) * 100;
            
            slider.style.setProperty('--range-percent', `${percentage}%`);
            slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--shadow-dark) ${percentage}%, var(--shadow-dark) 100%)`;
        });
    }
});