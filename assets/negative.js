// negative.js - Negative Prompt Integration

document.addEventListener('DOMContentLoaded', function() {
    // Toggle negative prompt section
    const negativePromptToggle = document.getElementById('negative-prompt-toggle');
    const negativePromptContent = document.getElementById('negative-prompt-content');
    const negativePromptArrow = document.querySelector('.negative-prompt-arrow');
    
    negativePromptToggle.addEventListener('click', function() {
        negativePromptContent.classList.toggle('show');
        negativePromptArrow.classList.toggle('fa-chevron-down');
        negativePromptArrow.classList.toggle('fa-chevron-up');
    });

    // Common negative prompt suggestions
    const commonNegativePrompts = [
        "blurry", "distorted", "extra limbs", "bad anatomy", 
        "disfigured", "poorly drawn face", "mutated", 
        "ugly", "duplicate", "morbid", "mutilated", 
        "out of frame", "extra fingers", "mutated hands", 
        "poorly drawn hands", "missing arms", "long neck", 
        "cloned face", "malformed limbs", "missing legs", 
        "too many fingers", "low quality", "jpeg artifacts", 
        "signature", "watermark", "username", "text", 
        "cropped", "deformed", "dirty", "grainy", 
        "lowres", "blurry background", "out of focus", 
        "bad proportions", "unnatural pose", "unrealistic", 
        "cartoon", "3d", "doll", "overexposed", 
        "underexposed", "bad lighting", "bad shadow", 
        "hazy", "oversaturated", "undesaturated"
    ];

    // Display negative prompt suggestions
    const negativePromptSuggestions = document.getElementById('negative-prompt-suggestions');
    const negativePromptTextarea = document.getElementById('negative-prompt-textarea');
    const refreshNegativeSuggestions = document.getElementById('refresh-negative-suggestions');

    function generateNegativeSuggestions() {
        negativePromptSuggestions.innerHTML = '';
        
        // Shuffle array and pick 5 random suggestions
        const shuffled = [...commonNegativePrompts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        
        selected.forEach(prompt => {
            const suggestion = document.createElement('div');
            suggestion.className = 'prompt-suggestion';
            suggestion.textContent = prompt;
            suggestion.addEventListener('click', function() {
                // Add to negative prompt textarea with comma separation
                const currentValue = negativePromptTextarea.value.trim();
                if (currentValue) {
                    negativePromptTextarea.value = `${currentValue}, ${prompt}`;
                } else {
                    negativePromptTextarea.value = prompt;
                }
            });
            negativePromptSuggestions.appendChild(suggestion);
        });
    }

    refreshNegativeSuggestions.addEventListener('click', generateNegativeSuggestions);
    generateNegativeSuggestions();

    // Function to get negative prompt for API calls
    window.getNegativePrompt = function() {
        return negativePromptTextarea.value.trim();
    };

    // Function to clear negative prompt
    window.clearNegativePrompt = function() {
        negativePromptTextarea.value = '';
    };

    // Clear negative prompt when main prompt is cleared
    document.getElementById('clear-btn').addEventListener('click', function() {
        clearNegativePrompt();
    });
});