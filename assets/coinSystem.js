// coinSystem.js - Sistem Koin dengan Vercel Backend
document.addEventListener('DOMContentLoaded', function() {
    // ====================== KONFIGURASI ======================
    const COIN_KEY = 'ruangriung_coin_data';
    const INITIAL_COINS = 500;
    const COIN_RESET_HOURS = 24;
    const API_URL = 'https://arif-rouge.vercel.app/api/password'; 
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

    function initCoinSystem() {
        loadCoinData();
        updateUI();
        startResetTimer();
        setupEventListeners();
    }

    // ====================== FUNGSI MANAJEMEN KOIN ======================
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
                console.error("Error loading coin data:", e);
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
        showAlert('Coins Reset!', 'Your coins have been reset to ' + INITIAL_COINS, 'success');
    }

    function spendCoin() {
        if (coins <= 0) {
            showAlert('No Coins Left', 'Please wait for automatic reset', 'warning');
            return false;
        }
        
        coins--;
        saveCoinData();
        updateUI();
        
        if (coins === 0) {
            showAlert('Info', 'You have used all coins. Reset in 24 hours.', 'info');
        }
        return true;
    }

    // ====================== FUNGSI API ======================
    async function fetchAdminPassword() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json',
                    'Origin': 'https://ruangriung.my.id'
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.password;
        } catch (error) {
            console.error('Failed to fetch admin password:', error);
            showAlert('Connection Error', 'Cannot verify admin password. Please try again later.', 'error');
            return null;
        }
    }

    // ====================== FUNGSI TIMER ======================
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

    // ====================== FUNGSI UI ======================
    function updateUI() {
        if (coinCount) coinCount.textContent = coins;
        if (generateBtn) {
            generateBtn.classList.toggle('disabled', coins <= 0);
            generateBtn.title = coins <= 0 ? 'No coins available. Wait for reset.' : '';
        }
    }

    function showAlert(title, text, icon) {
        return Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonColor: '#6c5ce7',
            background: '#2d3436',
            color: '#ffffff',
            allowOutsideClick: false
        });
    }

    // ====================== EVENT HANDLERS ======================
    function setupEventListeners() {
        // Tombol Reset Coin (Admin)
        if (resetBtn) {
            resetBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                await handleAdminVerification();
            });
        }
    }

    async function handleAdminVerification() {
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
            background: '#2d3436',
            color: '#ffffff',
            confirmButtonColor: '#6c5ce7',
            cancelButtonColor: '#d63031',
            allowOutsideClick: false,
            customClass: {
                validationMessage: 'swal-validation-message'
            },
            preConfirm: (value) => {
                if (!value) {
                    Swal.showValidationMessage('Password cannot be empty');
                }
                return value;
            }
        });

        if (inputPassword) {
            const adminPassword = await fetchAdminPassword();
            
            if (adminPassword && inputPassword === adminPassword) {
                resetCoins();
            } else if (adminPassword) {
                showAlert('Access Denied', 'The admin password you entered is incorrect.', 'error');
            }
        }
    }

    // ====================== PUBLIC API ======================
    window.getCoins = () => coins;
    window.spendCoin = spendCoin;
    window.canGenerateImage = () => coins > 0;
});

// Style tambahan untuk SweetAlert
const style = document.createElement('style');
style.textContent = `
    .swal2-popup {
        background: #2d3436 !important;
        border: 1px solid #636e72 !important;
    }
    .swal2-title {
        color: #f5f6fa !important;
    }
    .swal2-content {
        color: #dfe6e9 !important;
    }
    .swal-validation-message {
        color: #fab1a0 !important;
    }
`;
document.head.appendChild(style);
