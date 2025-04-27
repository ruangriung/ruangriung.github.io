// coinSystem.js
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const COIN_KEY = 'ruangriung_coin_data';
    const INITIAL_COINS = 500; // Set default to 500 coins
    const COIN_RESET_HOURS = 24;
    const ADMIN_PASSWORD = "ruangriungadmin123"; // Change this in production!

    // Elements
    const coinCount = document.getElementById('coin-count');
    const resetBtn = document.getElementById('coin-reset-btn');
    const generateBtn = document.getElementById('generate-btn');
    const resetTimer = document.getElementById('reset-timer');

    // State
    let coins = INITIAL_COINS;
    let lastResetTime = Date.now();
    let timerInterval;

    // Initialize
    loadCoinData();
    updateUI();
    setupEventListeners();
    startResetTimer();

    // ======================
    // CORE FUNCTIONALITY
    // ======================

    function loadCoinData() {
        const savedData = localStorage.getItem(COIN_KEY);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                const now = Date.now();
                const hoursSinceReset = (now - data.lastResetTime) / (1000 * 60 * 60);
                
                if (hoursSinceReset >= COIN_RESET_HOURS) {
                    resetCoins();
                } else {
                    coins = data.coins;
                    lastResetTime = data.lastResetTime;
                }
            } catch (e) {
                console.error('Error loading coin data:', e);
                resetCoins();
            }
        } else {
            resetCoins();
        }
    }

    function saveCoinData() {
        localStorage.setItem(COIN_KEY, JSON.stringify({
            coins: coins,
            lastResetTime: lastResetTime
        }));
    }

    function resetCoins() {
        coins = INITIAL_COINS;
        lastResetTime = Date.now();
        saveCoinData();
        updateUI();
        showNotification(getTranslation('coins_reset'));
    }

    function spendCoin() {
        if (coins <= 0) return false;
        
        coins--;
        saveCoinData();
        updateUI();
        
        if (coins === 0) {
            showNotification(getTranslation('no_coins_left'));
        }
        return true;
    }

    // ======================
    // TIMER FUNCTIONALITY
    // ======================

    function startResetTimer() {
        clearInterval(timerInterval); // Clear existing timer
        updateResetTimerDisplay(); // Immediate update
        timerInterval = setInterval(updateResetTimerDisplay, 1000); // Update every second
    }

    function updateResetTimerDisplay() {
        const now = Date.now();
        const resetTime = lastResetTime + (COIN_RESET_HOURS * 60 * 60 * 1000);
        const timeLeft = resetTime - now;

        if (timeLeft <= 0) {
            resetCoins();
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        if (resetTimer) {
            resetTimer.textContent = `${getTranslation('reset_in')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // ======================
    // UI UPDATES
    // ======================

    function updateUI() {
        // Update coin count
        if (coinCount) {
            coinCount.textContent = coins;
        }

        // Update generate button state
        if (generateBtn) {
            generateBtn.classList.toggle('no-coins', coins <= 0);
            generateBtn.title = coins <= 0 ? getTranslation('no_coins_tooltip') : '';
        }

        // Update reset button tooltip
        if (resetBtn) {
            resetBtn.title = getTranslation('reset_tooltip');
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'coin-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ======================
    // EVENT HANDLERS
    // ======================

    function setupEventListeners() {
        // Reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const password = prompt(getTranslation('enter_password'));
                if (password === ADMIN_PASSWORD) {
                    resetCoins();
                    startResetTimer(); // Restart the timer after manual reset
                } else {
                    showNotification(getTranslation('wrong_password'));
                }
            });
        }
    }

    // ======================
    // LANGUAGE SUPPORT
    // ======================

    function getTranslation(key) {
        const isIndonesian = document.getElementById('lang-id')?.classList.contains('active');
        
        const translations = {
            'reset_in': isIndonesian ? 'Reset dalam' : 'Reset in',
            'no_coins_left': isIndonesian ? 
                'Koin Anda sudah habis! Koin akan direset dalam 24 jam.' : 
                'You have no coins left! Coins will reset in 24 hours.',
            'enter_password': isIndonesian ? 
                'Masukkan password admin untuk mereset koin:' : 
                'Enter admin password to reset coins:',
            'coins_reset': isIndonesian ? 
                'Koin telah direset ke 500!' : 
                'Coins have been reset to 500!',
            'wrong_password': isIndonesian ? 
                'Password salah!' : 
                'Wrong password!',
            'reset_tooltip': isIndonesian ? 
                'Reset koin (hanya admin)' : 
                'Reset coins (admin only)',
            'no_coins_tooltip': isIndonesian ? 
                'Koin habis - tunggu reset 24 jam' : 
                'No coins - wait for 24h reset'
        };
        
        return translations[key] || '';
    }

    // ======================
    // PUBLIC API
    // ======================

    window.getCoins = () => coins;
    window.spendCoin = spendCoin;
    window.canGenerateImage = () => coins > 0;
    window.updateResetTimer = updateResetTimerDisplay;
});
