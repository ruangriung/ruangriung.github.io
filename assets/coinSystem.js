// coinSystem.js - Sistem Koin dengan Integrasi API Admin
document.addEventListener('DOMContentLoaded', function() {
    // ====================== KONFIGURASI ======================
    const COIN_KEY = 'ruangriung_coin_data';
    const INITIAL_COINS = 500;
    const COIN_RESET_HOURS = 24;
    const API_URL = 'https://ariftirtana.com/admin-api/';
    const API_KEY = 'hryhfjfh776(';
    
    // ====================== ELEMEN UI ======================
    const coinCount = document.getElementById('coin-count');
    const resetBtn = document.getElementById('coin-reset-btn');
    const generateBtn = document.getElementById('generate-btn');
    const resetTimer = document.getElementById('reset-timer');
    
    // ====================== STATE ======================
    let coins = INITIAL_COINS;
    let lastResetTime = Date.now();
    let timerInterval;

    // ====================== INISIALISASI ======================
    initCoinSystem();

    // ====================== FUNGSI UTAMA ======================
    function initCoinSystem() {
        loadCoinData();
        updateUI();
        startResetTimer();
        setupEventListeners();
    }

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
            } catch {
                resetCoins();
            }
        } else {
            resetCoins();
        }
    }

    function saveCoinData() {
        localStorage.setItem(COIN_KEY, JSON.stringify({ 
            coins, 
            lastResetTime 
        }));
    }

    function resetCoins() {
        coins = INITIAL_COINS;
        lastResetTime = Date.now();
        saveCoinData();
        updateUI();
        showAlert('Coins Reset!', 'Your coins have been reset to 500!', 'success');
    }

    function spendCoin() {
        if (coins <= 0) {
            showAlert('No Coins Left', 'Coins will reset in 24 hours', 'warning');
            return false;
        }
        
        coins--;
        saveCoinData();
        updateUI();
        
        if (coins === 0) {
            showAlert('No Coins Left', 'Wait for automatic reset', 'info');
        }
        return true;
    }

    // ====================== FUNGSI API ======================
    async function fetchAdminPassword() {
        try {
            const response = await fetch(API_URL, {
                headers: { 
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.password;
        } catch (error) {
            console.error('API Error:', error);
            showAlert('Connection Failed', 'Cannot verify admin password', 'error');
            return null;
        }
    }

    // ====================== TIMER FUNCTIONS ======================
    function startResetTimer() {
        clearInterval(timerInterval);
        updateResetTimerDisplay();
        timerInterval = setInterval(updateResetTimerDisplay, 1000);
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
            resetTimer.textContent = `Reset in ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        }
    }

    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    // ====================== UI FUNCTIONS ======================
    function updateUI() {
        if (coinCount) coinCount.textContent = coins;
        if (generateBtn) {
            generateBtn.disabled = coins <= 0;
            generateBtn.title = coins <= 0 ? 'Wait for coin reset' : '';
        }
    }

    function showAlert(title, text, icon) {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonColor: '#6c5ce7',
            background: '#2d3436',
            color: '#fff'
        });
    }

    // ====================== EVENT HANDLERS ======================
    function setupEventListeners() {
        // Tombol Reset Coin
        if (resetBtn) {
            resetBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await handlePasswordVerification();
            });
        }
    }

    async function handlePasswordVerification() {
        const { value: inputPassword } = await Swal.fire({
            title: 'Admin Verification',
            input: 'password',
            inputPlaceholder: 'Enter admin password',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Verify',
            cancelButtonText: 'Cancel',
            backdrop: `
                rgba(0,0,0,0.7)
                url("https://ruangriung.my.id/images/admin-bg.png")
                center top
                no-repeat
            `,
            allowOutsideClick: false
        });

        if (inputPassword) {
            const adminPassword = await fetchAdminPassword();
            
            if (adminPassword && inputPassword === adminPassword) {
                resetCoins();
            } else {
                showAlert('Access Denied', 'Invalid admin credentials', 'error');
            }
        }
    }

    // ====================== PUBLIC API ======================
    window.getCoins = () => coins;
    window.spendCoin = spendCoin;
    window.canGenerateImage = () => coins > 0;
});

// Inisialisasi SweetAlert theme
const swalTheme = document.createElement('style');
swalTheme.textContent = `
    .swal2-popup {
        background: #2d3436 !important;
        color: #fff !important;
    }
`;
document.head.appendChild(swalTheme);
