// coinSystem.js
document.addEventListener('DOMContentLoaded', function() {
    const COIN_KEY = 'ruangriung_coin_data';
    const INITIAL_COINS = 500;
    const COIN_RESET_HOURS = 24;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Menggunakan environment variable

    const coinCount = document.getElementById('coin-count');
    const resetBtn = document.getElementById('coin-reset-btn');
    const generateBtn = document.getElementById('generate-btn');
    const resetTimer = document.getElementById('reset-timer');

    let coins = INITIAL_COINS;
    let lastResetTime = Date.now();
    let timerInterval;

    loadCoinData();
    updateUI();
    setupEventListeners();
    startResetTimer();

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
        localStorage.setItem(COIN_KEY, JSON.stringify({ coins, lastResetTime }));
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

    function updateUI() {
        if (coinCount) coinCount.textContent = coins;
        if (generateBtn) {
            generateBtn.classList.toggle('no-coins', coins <= 0);
            generateBtn.title = coins <= 0 ? 'No coins - wait for 24h reset' : '';
        }
    }

    function setupEventListeners() {
        if (resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                e.preventDefault();
                Swal.fire({
                    title: 'Enter Admin Password',
                    html: `
                        <div style="display:flex;flex-direction:column;gap:10px;">
                            <input id="admin-password" type="password" class="swal2-input" placeholder="Enter admin password...">
                            <label style="font-size:0.9em;cursor:pointer;display:flex;align-items:center;gap:8px;">
                                <input type="checkbox" id="toggle-password">
                                Show Password
                            </label>
                        </div>
                        <div style="margin-top:10px;text-align:left;font-size:0.8em;color:#666;">
                            Contact admin:<br>
                            - <a href="https://www.facebook.com/groups/1182261482811767" target="_blank">Facebook Group</a><br>
                            - <a href="mailto:admin@ruangriung.my.id">admin@ruangriung.my.id</a>
                        </div>
                    `,
                    focusConfirm: false,
                    preConfirm: () => document.getElementById('admin-password').value,
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    background: getComputedStyle(document.body).getPropertyValue('--bg'),
                    color: getComputedStyle(document.body).getPropertyValue('--text'),
                    confirmButtonColor: '#6c5ce7',
                    cancelButtonColor: '#d63031'
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (result.value === ADMIN_PASSWORD) {
                            resetCoins();
                            startResetTimer();
                        } else {
                            showSweetAlert('Wrong Password!', 'The admin password you entered is incorrect.', 'error');
                        }
                    }
                });

                setTimeout(() => {
                    const toggle = document.getElementById('toggle-password');
                    const passwordField = document.getElementById('admin-password');
                    if (toggle && passwordField) {
                        toggle.addEventListener('change', function() {
                            passwordField.type = this.checked ? 'text' : 'password';
                        });
                    }
                }, 300);
            });
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

    // Public API
    window.getCoins = () => coins;
    window.spendCoin = spendCoin;
    window.canGenerateImage = () => coins > 0;
    window.updateResetTimer = updateResetTimerDisplay;
});
