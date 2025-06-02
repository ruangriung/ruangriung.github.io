// coinSystem.js - Sistem Koin dengan Vercel Backend
document.addEventListener('DOMContentLoaded', function() {
    // ====================== KONFIGURASI ======================
    const COIN_KEY = 'ruangriung_coin_data_v2';
    const INITIAL_COINS = 500;
    const COIN_RESET_HOURS = 24;
    const API_URL = 'https://arif-rouge.vercel.app/api/password';
    const API_KEY = 'hryhfjfh776(';
    const DEBUG_MODE = true; // Set false di production

    // ====================== ELEMEN UI ======================
    const ui = {
        coinCount: document.getElementById('coin-count'),
        resetBtn: document.getElementById('coin-reset-btn'),
        generateBtn: document.getElementById('generate-btn'),
        resetTimer: document.getElementById('reset-timer')
    };

    // ====================== STATE ======================
    let state = {
        coins: INITIAL_COINS,
        lastResetTime: Date.now(),
        timerInterval: null
    };

    // ====================== INISIALISASI ======================
    init();

    function init() {
        logDebug('System initialized');
        loadCoinData();
        updateUI();
        startResetTimer();
        setupEventListeners();
    }

    // ====================== CORE FUNCTIONS ======================
    function loadCoinData() {
        try {
            const savedData = localStorage.getItem(COIN_KEY);
            if (!savedData) {
                logDebug('No saved data, using defaults');
                resetCoins();
                return;
            }

            const data = JSON.parse(savedData);
            const hoursSinceReset = (Date.now() - data.lastResetTime) / (1000 * 60 * 60);
            
            if (hoursSinceReset >= COIN_RESET_HOURS) {
                logDebug('Auto-resetting coins (24h passed)');
                resetCoins();
            } else {
                state.coins = data.coins;
                state.lastResetTime = data.lastResetTime;
                logDebug(`Loaded coins: ${state.coins}, last reset: ${new Date(state.lastResetTime)}`);
            }
        } catch (e) {
            console.error('Load error:', e);
            resetCoins();
        }
    }

    function saveCoinData() {
        localStorage.setItem(COIN_KEY, JSON.stringify({
            coins: state.coins,
            lastResetTime: state.lastResetTime
        }));
        logDebug('Data saved to localStorage');
    }

    function resetCoins() {
        state.coins = INITIAL_COINS;
        state.lastResetTime = Date.now();
        saveCoinData();
        updateUI();
        showAlert('Coins Reset!', `Your coins have been reset to ${INITIAL_COINS}`, 'success');
        logDebug('Coins reset performed');
    }

    function spendCoin() {
        if (state.coins <= 0) {
            showAlert('No Coins Left', 'Please wait for automatic reset', 'warning');
            return false;
        }
        
        state.coins--;
        saveCoinData();
        updateUI();
        
        if (state.coins === 0) {
            showAlert('Info', 'Coins will reset in 24 hours', 'info');
        }
        logDebug(`Coin spent. Remaining: ${state.coins}`);
        return true;
    }

    // ====================== API INTEGRATION ======================
    async function fetchAdminPassword() {
        try {
            logDebug('Fetching admin password...');
            const timestamp = Date.now();
            
            const response = await fetch(`${API_URL}?t=${timestamp}`, {
                headers: { 
                    'X-API-Key': API_KEY,
                    'Origin': 'https://ruangriung.my.id'
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            logDebug('API response:', data);
            
            if (!data.password) {
                throw new Error('Invalid response format');
            }
            
            return data.password;
        } catch (error) {
            console.error('API Error:', error);
            showAlert(
                'Connection Error', 
                `Cannot verify admin password. ${DEBUG_MODE ? error.message : ''}`, 
                'error'
            );
            return null;
        }
    }

    // ====================== TIMER FUNCTIONS ======================
    function startResetTimer() {
        clearInterval(state.timerInterval);
        updateResetTimerDisplay();
        state.timerInterval = setInterval(updateResetTimerDisplay, 1000);
        logDebug('Reset timer started');
    }

    function updateResetTimerDisplay() {
        const resetTime = state.lastResetTime + (COIN_RESET_HOURS * 60 * 60 * 1000);
        const timeLeft = resetTime - Date.now();

        if (timeLeft <= 0) {
            resetCoins();
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        if (ui.resetTimer) {
            ui.resetTimer.textContent = `Reset in ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        }
    }

    // ====================== UI FUNCTIONS ======================
    function updateUI() {
        if (ui.coinCount) ui.coinCount.textContent = state.coins;
        if (ui.generateBtn) {
            ui.generateBtn.classList.toggle('disabled', state.coins <= 0);
            ui.generateBtn.title = state.coins <= 0 ? 'No coins available' : '';
        }
        logDebug('UI updated', { coins: state.coins });
    }

    function showAlert(title, text, icon) {
        logDebug(`Alert shown: ${title} - ${text}`);
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonColor: '#6c5ce7',
            background: '#2d3436',
            color: '#ffffff',
            allowOutsideClick: false
        });
    }

    // ====================== EVENT HANDLERS ======================
    function setupEventListeners() {
        if (ui.resetBtn) {
            ui.resetBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await handleAdminVerification();
            });
        }
        logDebug('Event listeners setup');
    }

    async function handleAdminVerification() {
        logDebug('Admin verification initiated');
        
        const { value: inputPassword } = await Swal.fire({
            title: 'Admin Verification',
            input: 'password',
            inputPlaceholder: 'Enter admin password',
            showCancelButton: true,
            confirmButtonText: 'Verify',
            cancelButtonText: 'Cancel',
            background: '#2d3436',
            color: '#ffffff',
            allowOutsideClick: false,
            preConfirm: (value) => {
                if (!value) {
                    Swal.showValidationMessage('Password cannot be empty');
                    return false;
                }
                return value;
            }
        });

        if (inputPassword) {
            const adminPassword = await fetchAdminPassword();
            
            if (adminPassword && inputPassword === adminPassword) {
                resetCoins();
            } else if (adminPassword) {
                showAlert('Access Denied', 'Incorrect admin password', 'error');
            }
        }
    }

    // ====================== UTILITIES ======================
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    function logDebug(...messages) {
        if (DEBUG_MODE) {
            console.log('[DEBUG]', ...messages);
        }
    }

    // ====================== PUBLIC API ======================
    window.ruangriungCoin = {
        getCoins: () => state.coins,
        spendCoin: spendCoin,
        canGenerate: () => state.coins > 0,
        debug: () => {
            console.log('Current state:', state);
            return state;
        }
    };
});

// ====================== STYLE INJECTION ======================
const style = document.createElement('style');
style.textContent = `
    .swal2-popup {
        background: #2d3436 !important;
        border-radius: 12px !important;
    }
    .swal2-title {
        font-size: 1.5rem !important;
    }
    .disabled {
        opacity: 0.5;
        cursor: not-allowed !important;
    }
`;
document.head.appendChild(style);
