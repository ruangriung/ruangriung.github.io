// coinSystem.js - Sistem Koin dengan API Password Eksternal
document.addEventListener('DOMContentLoaded', function() {
    // ====================== KONFIGURASI ======================
    const COIN_KEY = 'ruangriung_coin_data';
    const INITIAL_COINS = 500;
    const COIN_RESET_HOURS = 24;
    const API_ENDPOINT = 'https://ariftirtana.com/admin-api/'; 
    const API_KEY = 'hryhfjfh776('; // Harus sama dengan di config.php

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
    loadCoinData();
    updateUI();
    startResetTimer();
    setupEventListeners();

    // ====================== FUNGSI UTAMA ======================
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
        showSweetAlert('Coins Reset!', 'Your coins have been reset to 500!', 'success');
    }

    function spendCoin() {
        if (coins <= 0) {
            showSweetAlert('No Coins Left', 'You have no coins left! Coins will reset in 24 hours.', 'warning');
            return false;
        }
        
        coins--;
        saveCoinData();
        updateUI();
        
        if (coins === 0) {
            showSweetAlert('No Coins Left', 'You have no coins left! Coins will reset in 24 hours.', 'warning');
        }
        return true;
    }

    // ====================== FUNGSI API ======================
    async function fetchAdminPassword() {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'GET',
                headers: { 
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            return data.password;
        } catch (error) {
            console.error('Failed to fetch admin password:', error);
            showSweetAlert('Connection Error', 'Cannot connect to admin server. Please try again later.', 'error');
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
            resetTimer.textContent = `Reset in ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // ====================== UI FUNCTIONS ======================
    function updateUI() {
        if (coinCount) coinCount.textContent = coins;
        if (generateBtn) {
            generateBtn.classList.toggle('no-coins', coins <= 0);
            generateBtn.title = coins <= 0 ? 'No coins - wait for 24h reset' : '';
        }
    }

    function showSweetAlert(title, text, icon = 'success') {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonText: 'OK',
            confirmButtonColor: '#6c5ce7',
            background: getComputedStyle(document.body).getPropertyValue('--bg'),
            color: getComputedStyle(document.body).getPropertyValue('--text')
        });
    }

    // ====================== EVENT HANDLERS ======================
    function setupEventListeners() {
        // Tombol Reset Coin (Admin)
        if (resetBtn) {
            resetBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                
                const { value: inputPassword } = await Swal.fire({
                    title: 'Enter Admin Password',
                    input: 'password',
                    inputAttributes: { autocapitalize: 'off' },
                    html: `
                        <div style="margin-top:10px;text-align:left;font-size:0.8em;color:#666;">
                            Contact admin if you forgot the password
                        </div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    backdrop: true,
                    preConfirm: () => {
                        const password = document.getElementById('swal-input1').value;
                        if (!password) {
                            Swal.showValidationMessage('Password cannot be empty');
                        }
                        return password;
                    }
                });

                if (inputPassword) {
                    const adminPassword = await fetchAdminPassword();
                    
                    if (adminPassword && inputPassword === adminPassword) {
                        resetCoins();
                        startResetTimer();
                    } else {
                        showSweetAlert('Wrong Password!', 'The admin password you entered is incorrect.', 'error');
                    }
                }
            });
        }
    }

    // ====================== PUBLIC API ======================
    window.getCoins = () => coins;
    window.spendCoin = spendCoin;
    window.canGenerateImage = () => coins > 0;
    window.updateResetTimer = updateResetTimerDisplay;
});
