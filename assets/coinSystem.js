
document.addEventListener('DOMContentLoaded', function() {
    // Konfigurasi Sistem Coin
    const COIN_KEY = 'ruangriung_coin_data';
    const INITIAL_COINS = 500;
    const COIN_RESET_HOURS = 24;

    // Elemen UI
    const coinCount = document.getElementById('coin-count');
    const resetBtn = document.getElementById('coin-reset-btn');
    const generateBtn = document.getElementById('generate-btn');
    const resetTimer = document.getElementById('reset-timer');

    // State
    let coins = INITIAL_COINS;
    let lastResetTime = Date.now();
    let timerInterval;

    // Inisialisasi
    loadCoinData();
    updateUI();
    setupEventListeners();
    startResetTimer();

    // Fungsi Utama
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
                console.error("Error parsing coin data:", e);
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
        showSweetAlert('Success', 'Your coins have been reset to 500!', 'success');
    }

    function spendCoin() {
        if (coins <= 0) {
            showSweetAlert('No Coins', 'You have no coins left! Coins will reset in 24 hours.', 'warning');
            return false;
        }
        coins--;
        saveCoinData();
        updateUI();
        return true;
    }

    // Fungsi Pendukung UI
    function updateUI() {
        if (coinCount) coinCount.textContent = coins;
        if (generateBtn) {
            generateBtn.classList.toggle('disabled', coins <= 0);
            generateBtn.title = coins <= 0 ? 'No coins available' : '';
        }
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
            resetTimer.textContent = `Reset in ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    // Fungsi Validasi Password via API
 // Ganti fungsi validasi dengan ini:
async function validateAdminPassword(inputPassword) {
  try {
    const response = await fetch(
      'https://ruangriung-github-f5n2so7gz-ruangriungs-projects.vercel.app/api/validate-password', 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword }),
      }
    );
    
    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}
    // Event Listeners
    function setupEventListeners() {
        if (!resetBtn) return;

        resetBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const { value: password } = await Swal.fire({
                title: 'Admin Access',
                html: `
                    <input type="password" id="password-input" class="swal2-input" placeholder="Enter admin password">
                    <label class="password-toggle">
                        <input type="checkbox" id="show-password"> Show password
                    </label>
                `,
                focusConfirm: false,
                preConfirm: () => {
                    return document.getElementById('password-input').value;
                },
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                customClass: {
                    popup: 'custom-swal'
                }
            });

            if (password) {
                const isValid = await validateAdminPassword(password);
                if (isValid) {
                    resetCoins();
                } else {
                    showSweetAlert('Error', 'Incorrect admin password', 'error');
                }
            }
        });
    }

    // Helper Function
    function showSweetAlert(title, text, icon) {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
        });
    }

    // Public API
    window.getCoins = () => coins;
    window.spendCoin = spendCoin;
    window.canGenerateImage = () => coins > 0;
});
